import * as React from 'react'
import { TextField } from '@mui/material'

export const Input = ({ value, onChange = e => {}, style = {}, ...props }) => {
  return (
    <TextField
      style={style}
      value={value}
      type="text"
      onChange={onChange}
      {...props}
    />
  )
}