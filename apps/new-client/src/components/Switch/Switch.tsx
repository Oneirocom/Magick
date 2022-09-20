import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

const SwitchComponent = ({ label: _label, checked, onChange }) => {
  const label = { inputProps: { 'aria-label': _label } }
  return (
    <FormControlLabel
      label={_label}
      control={<Switch {...label} checked={checked === true || checked === "true"} onChange={onChange} />}
    />
  )
}

export default SwitchComponent
