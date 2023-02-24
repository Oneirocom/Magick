import React from 'react'
import styles from './button.module.css'

const Button = ({ onClick = (e?: any) => {}, ...props }) => {
  return (
    <button onClick={onClick} className={styles['default']} {...props}>
      {props.children}
    </button>
  )
}

export default Button
