import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

const AddNewInput = props => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = e => {
    if (!value) return
    e.preventDefault()
    props.addInput(value)
    setValue('')
  }

  return (
    <Form
      value={value}
      placeHolder="Node input text..."
      onChange={onChange}
      onAdd={onAdd}
    />
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
    
    const newInputs = [...inputs, newInput]

    setInputs(newInputs)
    update(newInputs)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {inputs.map((input, i) => (
        <SingleElement
          name={input.name}
          key={i}
          delete={onDelete}
          type={input.socketType}
        />
      ))}
      <AddNewInput addInput={addInput} />
    </div>
  )
}

export default InputGenerator
