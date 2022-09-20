import Select from '../../../components/Select/Select'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const { values, defaultValue } = data

  const options = values.map(value => ({
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
