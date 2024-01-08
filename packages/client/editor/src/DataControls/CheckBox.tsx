// DOCUMENTED
/**
 * A control component that renders a checkbox and updates data based on user input.
 * This component uses the MUI Checkbox and FormControlLabel components.
 *
 * @param {Object} props - The props object that contains the control, updateData and initialValue.
 * @param {Object} props.control - The "control" object that contains the dataKey and data.
 * @param {Function} props.updateData - The function that updates the data based on user input.
 * @param {Boolean} props.initialValue - The initial value of the checkbox.
 * @returns {React.JSX.Element} - The JSX code that renders the CheckboxControl component.
 */
import { useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

const CheckBoxControl = ({ control, updateData, initialValue }) => {
  // Extract relevant properties from props
  const { dataKey, data } = control
  // Initialize the checked state with the initialValue prop
  const [checked, setChecked] = useState(initialValue)

  /**
   * Handle the onChange event of the checkbox.
   * @param {Object} e - The event object.
   * @returns {void}
   */
  const onChange = e => {
    const isChecked = e.target.checked
    // Update the checked state
    setChecked(isChecked)
    // Update the data using the updateData prop method
    updateData({ [dataKey]: isChecked })
  }

  return (
    <span>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChange} />}
          label={data.label}
        />
      </FormGroup>
    </span>
  )
}

export default CheckBoxControl
