import * as React from 'react'
import { TextField } from '@mui/material'
import styles from './input.module.css'
export const Input = ({
  value,
  type,
  placeHolder,
  onChange = e => {},
  multiline=false,
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
      multiline={multiline}
      {...props}
    />
  )
}
