// DOCUMENTED

import { useState } from 'react'
import { Switch } from 'client/core'

/**
 * A control component for a switch UI element that updates data in the parent component.
 * @param control - The control object containing dataKey and data properties.
 * @param updateData - A function to update data in the parent component.
 * @param initialValue - An object containing the initial value of the switch.
 * @returns A SwitchControl component.
 */
const SwitchControl = ({ control, updateData, initialValue }) => {
  // Destructure necessary properties from control and initialValue.
  const { dataKey, data } = control
  const { receivePlaytest } = initialValue

  // Set the initial state of the switch based on receivePlaytest.
  const initial =
    typeof receivePlaytest === 'boolean'
      ? receivePlaytest
      : receivePlaytest === 'true'
  const [checked, setChecked] = useState(initial)

  /**
   * Updates the value of the switch and calls the updateData function to update parent component data.
   * @param e - The event object passed by the onChange event.
   */
  const onChange = e => {
    const playtest = e.target.checked
    setChecked(playtest)

    updateData({
      [dataKey]: {
        receivePlaytest: playtest,
      },
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      {/* Render the Switch component with necessary props. */}
      <Switch checked={checked} onChange={onChange} label={data.label} />
    </div>
  )
}

export default SwitchControl
