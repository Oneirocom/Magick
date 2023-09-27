// DOCUMENTED
/**
 * InputControl is a reusable React component that allows the user to create an input control with optional initial value,
 * and a callback function that gets called every time the value of the input is changed.
 * @param control - an object that describes the input control, should have a name and a dataKey property
 * @param updateData - a callback function that gets called with an object containing the new value of the input control
 * @param initialValue - optional initial value for the input control
 */

import React, { useState } from 'react'
import { Input } from 'client/core'

const InputControl: React.FC<{
  control: { name: string; dataKey: string }
  updateData: (data: any) => void
  initialValue?: string
}> = ({ control, updateData, initialValue = '' }) => {
  // useState hook to keep track of the value of the input control.
  const [value, setValue] = useState(initialValue)

  // Destructure the dataKey property of the control object.
  const { dataKey } = control

  // Event handler function that updates the state with the new value, and calls the callback function with the new value.
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '\\n' ? '\n' : e.target.value
    setValue(newValue)
    updateData({ [dataKey]: newValue })
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Input
        style={{ width: '100%' }}
        value={value}
        type="text"
        onChange={onChange}
        placeHolder={`Enter ${control.name} here`}
      />
    </div>
  )
}

export default InputControl
