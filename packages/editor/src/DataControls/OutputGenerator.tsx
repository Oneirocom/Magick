import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

const AddNewOutput = props => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = () => {
    props.addOutput(value)
    setValue('')
  }

  return (
    <Form
      value={value}
      placeHolder="Node output text..."
      onChange={onChange}
      onAdd={onAdd}
    />
  )
}

const OutputGenerator = ({ updateData, control, initialValue }) => {
  const [outputs, setOutputs] = useState([...initialValue])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) return
    const newOutputs = initialValue.filter(
      output =>
        !control.data.ignored.some(ignored => ignored.name === output.name)
    )
    setOutputs(newOutputs)
  }, [initialValue, control])

  const onDelete = name => {
    const newOutputs = outputs.filter(output => output.name !== name)
    setOutputs(newOutputs)
    update(newOutputs)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const addOutput = output => {
    const newOutput = {
      name: output,
      socketType: data.socketType,
      taskType: data.taskType || 'output',
    }

    const newOutputs = [...outputs, newOutput]
    setOutputs(newOutputs)
    update(newOutputs)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {outputs.map((out, i) => (
        <SingleElement
          name={out.name}
          key={i}
          delete={onDelete}
          type={out.socketType}
        />
      ))}
      <AddNewOutput addOutput={addOutput} />
    </div>
  )
}

export default OutputGenerator
