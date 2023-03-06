import * as React from 'react'
import { TextField } from '@mui/material'
import styles from './input.module.scss'
export const Input = ({
  value,
  type,
  placeHolder,
  onChange = e => {},
  style = {},
  ...props
}) => {
  return (
    <TextField
      classes={{ root: styles.root }}
      style={style}
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeHolder}
      {...props}
    />
  )
}
