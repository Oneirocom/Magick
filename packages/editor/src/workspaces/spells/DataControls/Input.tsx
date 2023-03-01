import { useState } from 'react'

import { Input } from '@magickml/client-core'

const InputControl = ({ control, updateData, initialValue }) => {
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
