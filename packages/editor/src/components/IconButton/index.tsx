import IconButton from '@mui/material/IconButton'

interface Props {
  Icon: React.ReactNode
  label: string
  onClick?: () => void
  style?: {}
}

const IconBtn = (props: Props) => {
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

export default IconBtn
