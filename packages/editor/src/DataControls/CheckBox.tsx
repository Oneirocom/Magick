import { useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

const CheckBoxControl = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control
  const [checked, setChecked] = useState(initialValue)
  const onChange = e => {
    setChecked(e.target.checked)
    updateData({
      [dataKey]: e.target.checked,
    })
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
