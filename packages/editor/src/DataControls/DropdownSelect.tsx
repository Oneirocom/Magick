import { Select } from '@magickml/client-core'
import useSWR from 'swr'
import { OpenAI } from '../types/openai'
import { useEffect, useState } from 'react'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const { values, defaultValue } = data
  const [compositeValues, setCompositeValues] = useState(values)

  // @thomageanderson TODO: This is a hack to get the fine-tunes to show up in the dropdown until we have a vendor provider solution
  const { data: fineTuneData } =
    useSWR<OpenAI.List<OpenAI.FineTune>>('fine-tunes')

  useEffect(() => {
    if (fineTuneData && dataKey === 'spellName') {
      setCompositeValues([
        ...values,
        ...fineTuneData.data.map(fineTune => fineTune.fine_tuned_model),
      ])
    }
  }, [fineTuneData])

  const options = compositeValues.map(value => ({
    value: value,
    label: value,
  }))

  const value = initialValue?.length > 0 ? initialValue : defaultValue

  const defaultVal = { value, label: value }

  const onChange = async ({ value }) => {
    update(value)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  if (!defaultVal) return
  return (
    <div style={{ flex: 1 }}>
      <Select
        options={options}
        onChange={onChange}
        defaultValue={defaultVal}
        placeholder="select value"
        creatable={false}
      />
    </div>
  )
}

export default DropdownSelect
