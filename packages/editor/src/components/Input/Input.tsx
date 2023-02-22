import { TextField } from '@mui/material'

const Input = ({ value, onChange = e => {}, style = {}, ...props }) => {
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

export default Input
