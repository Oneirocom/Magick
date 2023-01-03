import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { alpha, styled } from '@mui/material/styles'

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--glow)',
    '&:hover': {
      backgroundColor: 'var(--glow-light)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var( --glow-dark)',
  },
}))

const SwitchComponent = ({ label: _label, checked, onChange }) => {
  const label = { inputProps: { 'aria-label': _label } }
  return (
    <FormControlLabel
      label={_label}
      control={
        <GreenSwitch
          {...label}
          checked={checked === true || checked === 'true'}
          onChange={onChange}
        />
      }
    />
  )
}

export default SwitchComponent
