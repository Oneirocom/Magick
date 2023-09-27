// DOCUMENTED
/**
 * Imports
 */
import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

/**
 * Add new output component
 *
 * @param {Object} props - The props object
 * @param {Function} props.addOutput - The function to add new outputs to the component
 *
 * @returns {JSX.Element} The add new output component
 */
const AddNewOutput = ({ addOutput }) => {
  /*
   * State
   */
  const [value, setValue] = useState('')

  /**
   * Handles the onChange event
   *
   * @param {Object} e - The event object
   *
   * @returns {void}
   */
  const onChange = e => {
    setValue(e.target.value)
  }

  /**
   * Handles the onAdd event
   *
   * @returns {void}
   */
  const onAdd = () => {
    addOutput(value)
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

/**
 * Output Generator component
 *
 * @param {Object} props - The props object
 * @param {Function} props.updateData - The function to update the component data
 * @param {Object} props.control - The control object
 * @param {Array} props.initialValue - The initial value of the outputs array
 *
 * @returns {JSX.Element} The output generator component
 */
const OutputGenerator = ({ updateData, control, initialValue }) => {
  /*
   * State
   */
  const [outputs, setOutputs] = useState([...initialValue])
  const { data, dataKey } = control

  /**
   * Handles the onDelete event
   *
   * @param {string} name - The name of the output item to delete
   *
   * @returns {void}
   */
  const onDelete = name => {
    const newOutputs = outputs.filter(output => output.name !== name)
    setOutputs(newOutputs)
    update(newOutputs)
  }

  /**
   * Handles the update event
   *
   * @param {Array} update - The new updates to apply
   *
   * @returns {void}
   */
  const update = update => {
    updateData({ [dataKey]: update })
  }

  /**
   * Handles the adding of new outputs
   *
   * @param {string} output - The name of the new output item
   *
   * @returns {void}
   */
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

  /**
   * Component did mount effect
   * Filters out ignored outputs
   */
  useEffect(() => {
    if (!initialValue) return
    const newOutputs = initialValue.filter(
      output =>
        !control.data.ignored.some(ignored => ignored.name === output.name)
    )
    setOutputs(newOutputs)
  }, [initialValue, control])

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
