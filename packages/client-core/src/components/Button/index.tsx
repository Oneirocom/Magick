import React from 'react'
import styles from './button.module.css'

export const Button = ({ onClick = (e?: any) => {}, ...props }) => {
  return (
    <button onClick={onClick} className={styles['default']} {...props}>
      {props.children}
    </button>
  )
}