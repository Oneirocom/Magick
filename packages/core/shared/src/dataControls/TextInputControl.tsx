// DOCUMENTED
import React, { useState, useEffect } from 'react'
import { Control } from 'shared/rete'
import { MagickEditor } from '../types'

/**
 * React text input props.
 */
type ReactTextInputProps = {
  editor: MagickEditor | null
  value: string
  name: string
  putData: (name: string, value: string) => void
  label?: string
}

/**
 * A functional React component used as a control in `TextInputControl`.
 * It handles rendering and managing state of the text input.
 */
const ReactTextInputControl: React.FC<ReactTextInputProps> = props => {
  // Set an initial value to be empty string
  const [value, setValue] = useState('')

  // Update state when properties change
  useEffect(() => {
    setValue(props.value)
    props.putData(props.name, props.value)
  }, [props])

  // Update redux state and local state when user changes input
  const onChange = e => {
    props.putData(props.name, e.target.value)
    setValue(e.target.value) // update local state
  }

  return (
    <React.Fragment>
      {props.label && <label htmlFor="">{props.label}</label>}
      <input
        type="text"
        value={value}
        placeholder={`Insert ${props.label} here`}
        style={{ marginTop: 'var((--c1)' }}
        onChange={onChange}
      />
    </React.Fragment>
  )
}

/**
 * A custom Rete control for a text input. It extends the Control class
 * from Rete and provides a renderer for a React component.
 */
export class TextInputControl extends Control {
  render: string
  component: React.FC<ReactTextInputProps>
  props: ReactTextInputProps

  /**
   * Constructor for the custom TextInputControl control.
   * @param {object} param0 - An object containing editor, key, value, and label properties
   * @property {MagickEditor|null} param0.editor - The associated Rete editor
   * @property {string} param0.key - The input key to identify this control
   * @property {string} param0.value - The initial input value
   * @property {string} [param0.label] - The label to display with the text input (optional)
   */
  constructor({
    editor,
    key,
    value,
    label = undefined,
  }: {
    editor: MagickEditor | null
    key: string
    value: string
    label?: string
  }) {
    super(key)
    this.render = 'react'
    this.component = ReactTextInputControl

    // Define the properties that are passed into the rendered React component
    this.props = {
      editor,
      name: key,
      label,
      value,
      putData: (key: string, data: unknown) => this.putData(key, data),
    }
  }
}
