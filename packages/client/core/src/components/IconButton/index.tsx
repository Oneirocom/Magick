// DOCUMENTED
import * as React from 'react'
import IconButton from '@mui/material/IconButton'

/**
 * Props interface for IconBtn component.
 */
interface Props {
  Icon: React.ReactNode // Icon component to be rendered
  label: string // Aria-label for the IconButton
  onClick?: (e) => void // Optional onClick handler
  style?: React.CSSProperties // Optional custom styles
}

/**
 * IconBtn component - IconButton with custom Icon and label.
 *
 * @param {Props} props - IconBtn component properties
 * @returns {React.ReactElement} - Rendered IconBtn component
 */
export const IconBtn: React.FunctionComponent<Props> = (
  props: Props
): React.JSX.Element => {
  const { Icon, label, onClick, style } = props

  return (
    <IconButton
      color="inherit"
      aria-label={label}
      component="label"
      onClick={onClick}
      style={style}
    >
      {Icon}
    </IconButton>
  )
}
