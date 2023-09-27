// DOCUMENTED
/**
 * SwitchControl component that returns a toggle switch.
 *
 * @param control an object that contains dataKey and data properties.
 * @param updateData a function that takes an object as its parameter.
 * @param initialValue a boolean that represents the initial value of the switch.
 */
import { useState } from 'react'
import { Switch } from 'client/core'

const SwitchControl = ({ control, updateData, initialValue }) => {
  // Destructure the dataKey and data properties from the control object.
  const { dataKey, data } = control

  // Set up the checked state with the initial value passed as a prop.
  const [checked, setChecked] = useState(initialValue)

  /**
   * Function that updates the value of the checked state and calls the updateData prop function.
   * @param e SyntheticEvent originated from DOM element onChange event.
   */
  const onChange = e => {
    setChecked(e.target.checked)
    updateData({
      [dataKey]: e.target.checked,
    })
  }

  return (
    // Return a div that wraps the Switch component with its props received from data object.
    <div style={{ flex: 1, display: 'flex' }}>
      <Switch checked={checked} onChange={onChange} label={data.label} />
    </div>
  )
}

export default SwitchControl
