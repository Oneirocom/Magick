// DOCUMENTED
/**
 * A component that displays a dropdown select menu based on some control object
 * @param control - The control object that contains the dataKey, data, etc.
 * @param updateData - The update function to update the selected value in the parent component state
 * @param initialValue - The initial selected value
 */

import { Select } from '@magickml/client-core'
import useSWR from 'swr'
import { OpenAI } from '../types/openai'
import { useEffect, useState } from 'react'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const { values, defaultValue } = data
  const [compositeValues, setCompositeValues] = useState(values)

  /**
   * wait for the fine-tune data before updating the composite values with the model name
   */
  // TODO: Move to plugin
  const { data: fineTuneData } =
    useSWR<OpenAI.List<OpenAI.FineTune>>('fine-tunes')

  useEffect(() => {
    if (fineTuneData && dataKey === 'spellName') {
      setCompositeValues([
        ...values,
        ...fineTuneData.data.map(fineTune => fineTune.fine_tuned_model),
      ])
    }
  }, [dataKey, fineTuneData, values])

  const options = compositeValues.map(value => ({
    value: value,
    label: value,
  }))

  const value = initialValue?.length > 0 ? initialValue : defaultValue

  const defaultVal = { value, label: value }

  /**
   * Called when the user selects a new value from the dropdown
   */
  const onChange = async ({ value }) => {
    update(value)
  }

  /**
   * Updates the selected value in the parent component state
   */
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
