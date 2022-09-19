import { useState, useEffect } from 'react'

const SingleOutput = props => {
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
    <div style={{ display: 'flex', gap: 'var(--extraSmall)' }}>
      <input
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
        placeholder={'Node output text...'}
      />
      <button style={{ flex: 1 }} onClick={onAdd}>
        + Add
      </button>
    </div>
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
        <SingleOutput name={out.name} key={i} delete={onDelete} />
      ))}
      <AddNewOutput addOutput={addOutput} />
    </div>
  )
}

export default OutputGenerator
