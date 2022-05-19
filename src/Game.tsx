import { useCallback, useState } from "react"
import { css } from "@emotion/css"

import { Board, BoardOptions } from "./components/Board"
import { Button } from "./components/Button"

const defaultOptions: BoardOptions = {
  rows: 10,
  columns: 10,
  bombs: 10
}

export default function Game() {
  const [options, setOptions] = useState(defaultOptions)

  const handleRestart = useCallback(() => {
    setOptions(defaultOptions)
  }, [])

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Board {...options} />
    </div>
  )
}
