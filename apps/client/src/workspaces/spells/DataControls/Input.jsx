import { useState } from 'react'

import InputComponent from '../../../components/Input/Input'

const Input = ({ control, updateData, initialValue }) => {
  const [value, setValue] = useState(initialValue)
  const { dataKey } = control

  const onChange = e => {
    setValue(e.target.value)
    const value = e.target.value === '\\n' ? '\n' : e.target.value
    updateData({
      [dataKey]: value,
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <InputComponent
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
      />
    </div>
  )
}

export default Input
