import { useState, useEffect } from 'react'

const SingleInput = props => {
  return (
    <div style={{ marginBottom: 10, flex: 1, width: '100%' }}>
      <p style={{ display: 'inline' }}>{props.name}</p>
      <span style={{ float: 'right' }}>
        <button className="list" onClick={() => props.delete(props.name)}>
          Delete
        </button>
      </span>
    </div>
  )
}

const AddNewInput = props => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = () => {
    props.addInput(value)
    setValue('')
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--extraSmall)' }}>
      <input
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
        placeholder={'Node input text...'}
      />
      <button style={{ flex: 1 }} onClick={onAdd}>
        + Add
      </button>
    </div>
  )
}

const InputGenerator = ({ updateData, control, initialValue }) => {
  const [inputs, setInputs] = useState([...initialValue])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) return
    const newInputs = initialValue.filter(
      input => !data.ignored.some(ignored => ignored.name === input.name)
    )
    console.log('new inputs', newInputs)
    setInputs(newInputs)
  }, [initialValue])

  const onDelete = name => {
    const newInputs = inputs.filter(input => input.name !== name)
    setInputs(newInputs)
    update(newInputs)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const addInput = input => {
    const newInput = {
      name: input,
      socketType: data.socketType,
    }
    console.log('Adding new input', newInput)

    const newInputs = [...inputs, newInput]

    setInputs(newInputs)
    update(newInputs)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {inputs.map((input, i) => (
        <SingleInput name={input.name} key={i} delete={onDelete} />
      ))}
      <AddNewInput addInput={addInput} />
    </div>
  )
}

export default InputGenerator
