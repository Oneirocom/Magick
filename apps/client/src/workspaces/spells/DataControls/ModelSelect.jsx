import Select from '../../../components/Select/Select'
import { useState, useEffect } from 'react'

import { getModels } from '../../../services/game-api/text'

const ModelSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const { defaultValue } = data

  const [values, setValues] = useState([initialValue])
  const [descriptionList, setDescriptionList] = useState([])
  const [description, setDescription] = useState('')

  useEffect(async () => {
    const models = await getModels()
    console.log({ models })
    if (models) {
      const descList = {}
      models.map(x => (descList[x.alias] = x.description))
      setDescriptionList(descList)
      setValues(models.map(x => x.alias))
    }
  }, [])

  const options = values.map(value => ({
    value: value,
    label: value,
  }))

  const value = initialValue?.length > 0 ? initialValue : defaultValue

  const defaultVal = { value, label: value }

  const onChange = async ({ value }) => {
    setDescription(descriptionList[value])
    update(value)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  console.log({ description })

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
      <p>{description}</p>
    </div>
  )
}

export default ModelSelect
