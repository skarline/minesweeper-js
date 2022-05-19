import { useMemo } from "react"
import { css } from "@emotion/css"

export interface CellOptions {
  isRevealed: boolean
  isFlagged: boolean
  hasBomb: boolean
  bombsAround?: number
}

const base = css`
  background-color: var(--cell-color);
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  transition: 200ms background-color;
  user-select: none;
`

export function Cell({
  isRevealed,
  isFlagged,
  hasBomb,
  bombsAround = 0
}: CellOptions) {
  const style = useMemo(() => {
    if (isRevealed) {
      return css`
        background-color: var(--revealed-cell-color);
      `
    }

    return css`
      &:hover {
        background-color: var(--cell-hover-color);
      }
      &:active {
        background-color: var(--cell-active-color);
      }
    `
  }, [isRevealed])

  const textStyle = useMemo(() => {
    let colors = [
      "#000",
      "#a9def9",
      "#d0f4de",
      "#ff99c8",
      "#e4c1f9",
      "#fcf6bd",
      "#f9d0d0",
      "#f9d0d0",
      "#f9d0d0"
    ]

    return css`
      color: ${colors[bombsAround]};
    `
  }, [bombsAround])

  const content = useMemo(() => {
    if (isRevealed) {
      if (hasBomb) {
        return <span>💣</span>
      }
      if (bombsAround) {
        return <span>{bombsAround}</span>
      }
    }

    if (isFlagged) {
      return <span>🚩</span>
    }
  }, [isRevealed, isFlagged, hasBomb, bombsAround])

  return <div className={[base, style, textStyle].join(" ")}>{content}</div>
}
