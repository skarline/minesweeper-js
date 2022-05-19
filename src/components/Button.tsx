import { PropsWithChildren } from "react"
import { css } from "@emotion/css"

interface ButtonProps {
  onClick?: () => void
}

export function Button({
  children,
  onClick = () => {}
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={css`
        display: inline-flex;
        appearance: none;
        background-color: var(--button-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: 200ms background-color;

        &:hover {
          background-color: var(--button-hover-color);
        }
        &:active {
          background-color: var(--button-active-color);
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
