import { useState, useEffect, useCallback, MouseEvent } from "react"
import { css } from "@emotion/css"

import { Cell, CellOptions } from "./Cell"

import { cloneDeep, random, range, shuffle } from "lodash"

export interface BoardOptions {
  rows: number
  columns: number
  bombs: number
}

type gameState = "playing" | "won" | "lost"

export function Board({ rows, columns, bombs }: BoardOptions) {
  const [state, setState] = useState<gameState>("playing")
  const [cells, setCells] = useState<CellOptions[]>([])
  const [revealedCells, setRevealedCells] = useState(0)

  const plotCells = () => {
    const length = rows * columns

    const bombsIndices = shuffle(range(length)).slice(0, bombs)

    const cells = range(length).map((index) => {
      return {
        isRevealed: false,
        isFlagged: false,
        hasBomb: bombsIndices.includes(index)
      }
    })

    setCells(cells)
  }

  const getSurroundingIndices = (index: number) => {
    const row = Math.floor(index / columns)
    const column = index % columns

    const surrounding = []

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = column - 1; j <= column + 1; j++) {
        if (i === row && j === column) continue

        if (i < 0 || j < 0 || i >= rows || j >= columns) continue

        surrounding.push(i * columns + j)
      }
    }

    return surrounding
  }

  const handleCellClick = useCallback(
    (event: MouseEvent, index: number) => {
      event.preventDefault()

      const cell = cells[index]

      if (cell.isFlagged) return

      const newCells = cloneDeep(cells)

      const checkedCells = new Set()

      // Recursively reveal surrounding cells
      const recursiveReveal = (index: number) => {
        if (checkedCells.has(index)) return

        checkedCells.add(index)

        const cell = newCells[index]

        if (cell.isRevealed) return

        if (cell.hasBomb) {
          // If the first clicked cell has a bomb, move the bomb to another random cell
          if (revealedCells === 0) {
            let newBombIndex = index

            do {
              newBombIndex = random(cells.length)
            } while (cells[newBombIndex].hasBomb)

            newCells[index].hasBomb = false
            newCells[newBombIndex].hasBomb = true
          } else {
            // TODO: Game over
            newCells.forEach((cell) => (cell.isRevealed = true))

            setState("lost")
          }
        }

        const surrounding = getSurroundingIndices(index)
        const bombsAround = surrounding.filter(
          (i) => newCells[i].hasBomb
        ).length

        newCells[index] = {
          ...cell,
          isRevealed: true,
          bombsAround
        }

        if (bombsAround) return

        surrounding.forEach((i) => {
          recursiveReveal(i)
        })
      }

      if (cell.isRevealed) {
        const surrounding = getSurroundingIndices(index)

        const flagsAround = surrounding.filter((i) => cells[i].isFlagged).length

        if (flagsAround) {
          surrounding
            .filter((i) => !cells[i].isFlagged)
            .forEach((i) => recursiveReveal(i))
        }
      }

      recursiveReveal(index)

      setCells(newCells)
      setRevealedCells(newCells.filter((cell) => cell.isRevealed).length)

      if (revealedCells === rows * columns - bombs) {
        console.log("You win!")

        setState("won")
      }
    },
    [cells]
  )

  const handleCellFlag = useCallback(
    (event: MouseEvent, index: number) => {
      event.preventDefault()

      const newCells = cloneDeep(cells)

      newCells[index].isFlagged = !newCells[index].isFlagged

      setCells(newCells)
    },
    [cells]
  )

  const start = () => {
    setState("playing")
    plotCells()
  }

  useEffect(() => {
    plotCells()
  }, [])

  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        grid-gap: 0.25rem;
      `}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          onClick={(event) => handleCellClick(event, i)}
          onContextMenu={(event) => handleCellFlag(event, i)}
        >
          <Cell {...cell} />
        </div>
      ))}
    </div>
  )
}
