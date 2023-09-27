// DOCUMENTED
/**
 * A component that generates multiple inputs based on the `initialValue`.
 * @param {Object} props - Component props.
 * @param {Function} props.updateData - Function to update the data.
 * @param {Object} props.control - Provides access to the `data` and `dataKey`.
 * @param {Array} props.initialValue - Initial values that will populate the input fields.
 * @returns {JSX.Element} A component that generates multiple input fields.
 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Form from './Form'
import SingleElement from './SingleElement'

const AddNewInput = ({ addInput }) => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = e => {
    e.preventDefault()

    if (!value) {
      return
    }

    addInput(value)
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

AddNewInput.propTypes = {
  addInput: PropTypes.func.isRequired,
}

const InputGenerator = ({ updateData, control, initialValue }) => {
  const [inputs, setInputs] = useState([])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) {
      return
    }

    const newInputs = initialValue.filter(
      input => !data.ignored.some(ignored => ignored.name === input.name)
    )

    setInputs(newInputs)
  }, [data.ignored, initialValue])

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const onDelete = name => {
    const newInputs = inputs.filter(input => input.name !== name)
    setInputs(newInputs)
    update(newInputs)
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
      {inputs.map(({ name, socketType }, i) => (
        <SingleElement
          key={i}
          name={name}
          socketType={socketType}
          delete={() => onDelete(name)}
        />
      ))}
      <AddNewInput addInput={addInput} />
    </div>
  )
}

InputGenerator.propTypes = {
  updateData: PropTypes.func.isRequired,
  control: PropTypes.shape({
    data: PropTypes.shape({
      ignored: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      socketType: PropTypes.string.isRequired,
    }).isRequired,
    dataKey: PropTypes.string.isRequired,
  }).isRequired,
  initialValue: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      socketType: PropTypes.string.isRequired,
    })
  ),
}

InputGenerator.defaultProps = {
  initialValue: [],
}

export default InputGenerator
