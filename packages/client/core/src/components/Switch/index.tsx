// DOCUMENTED
// Import necessary React and Material UI components
import * as React from 'react'
import MUISwitch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'

// Define a styled GreenSwitch component leveraging Material UI switch component
const GreenSwitch = styled(MUISwitch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--primary)',
    '&:hover': {
      backgroundColor: 'var(--glow-light)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var( --primary-dark)',
  },
}))

/**
 * Switch component that uses the GreenSwitch styled component with a label.
 *
 * @param {string} _label - A string to set as the aria-label and display label for the switch.
 * @param {boolean | string} checked - A boolean or string value to set the switch checked state.
 * @param {function} onChange - A callback function to handle the state change of the switch.
 * @param {Object} props - Additional props to be passed to the component.
 */
export const Switch = ({ label: _label, checked, onChange, ...props }) => {
  // Set the label with the aria-label attribute
  const label = { inputProps: { 'aria-label': _label } }

  // Return the FormControlLabel component with the GreenSwitch as its control
  return (
    <FormControlLabel
      label={_label}
      control={
        <GreenSwitch
          {...label}
          checked={checked === true || checked === 'true'}
          onChange={onChange}
          {...props}
        />
      }
      {...props}
    />
  )
}
