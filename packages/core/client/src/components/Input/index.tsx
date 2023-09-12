// DOCUMENTED
import * as React from 'react'
import { TextField } from '@mui/material'
import styles from './input.module.css'

/**
 * The Input component is a wrapper around the Material-UI TextField component.
 * It extends the TextField and allows customization and a unified component in the application.
 */
export const Input = ({
  value,
  type,
  name,
  placeHolder,
  onChange = e => {
    /* null */
  },
  multiline = false,
  style = {},
  ...props
}: {
  value: string
  type: string
  name?: string
  placeHolder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  multiline?: boolean
  style?: React.CSSProperties
}) => {
  // Render the TextField component with the given props.
  return (
    <TextField
      classes={{ root: styles.root }} // Add custom styles to the TextField root.
      style={style} // Apply any given inline styles.
      name={name}
      value={value} // Set the current value of the input.
      type={type} // Set the input type (e.g., "text", "password", "number", etc.).
      onChange={onChange} // Add the custom event handler for input changes.
      placeholder={placeHolder} // Set the input placeholder text.
      multiline={multiline} // Enable/disable multiline input.
      {...props} // Spread any additional props to the TextField component.
    />
  )
}
