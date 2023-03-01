import * as React from 'react'
import { TextField } from '@mui/material'

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
      style={style}
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeHolder}
      {...props}
    />
  )
}
