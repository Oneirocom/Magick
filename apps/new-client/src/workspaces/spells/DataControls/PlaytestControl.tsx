import { useState } from 'react'

import Switch from '../../../components/Switch/Switch'

const SwitchControl = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control
  const { receivePlaytest } = initialValue
  const initial =
    typeof receivePlaytest === 'boolean'
      ? receivePlaytest
      : receivePlaytest === 'true'
  const [checked, setChecked] = useState(initial)

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
      <Switch checked={checked} onChange={onChange} label={data.label} />
    </div>
  )
}

export default SwitchControl
