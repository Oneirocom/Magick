import * as React from 'react'
import IconButton from '@mui/material/IconButton'

interface Props {
  Icon: React.ReactNode
  label: string
  onClick?: (e?) => void
  style?: object
}

export const IconBtn = (props: Props) => {
  return (
    <IconButton
      color="inherit"
      aria-label={props.label}
      component="label"
      onClick={props.onClick}
      style={props.style}
    >
      {props.Icon}
    </IconButton>
  )
}
