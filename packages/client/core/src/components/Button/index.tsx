// DOCUMENTED
import React, { MouseEventHandler, ButtonHTMLAttributes } from 'react'
import styles from './button.module.css'

/**
 * Button component. Provides onClick functionality and allows for props to be passed in.
 *
 * @param {object} props - The component properties.
 * @param {function} [onClick] - The click event handler function. Optional.
 */
export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    /* null */
  },
  ...props
}) => {
  return (
    // Render a button with the provided onClick handler and spread props
    <button
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      className={styles['default']}
      {...props}
    >
      {/* Render children within the button */}
      {props.children}
    </button>
  )
}
