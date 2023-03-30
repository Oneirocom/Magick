import React, { useState, useEffect } from 'react'
import { Control } from 'rete'
import { MagickEditor } from '../types'

type ReactTextInputProps = {
  editor: MagickEditor | null
  value: string
  name: string
  putData: (name: string, value: string) => void
  label?: string
}
const ReactTextInputControl:React.FC<ReactTextInputProps> = props => {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(props.value)
    props.putData(props.name, props.value)
  }, [props])

  const onChange = e => {
    props.putData(props.name, e.target.value)
    setValue(e.target.value)
    // props.editor.trigger('save')
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

export class TextInputControl extends Control {
  render: string
  component: React.FC<ReactTextInputProps>
  props: ReactTextInputProps
  constructor({ editor, key, value, label=undefined }: { editor: MagickEditor|null; key: string; value: string, label?: string }) {
    super(key)
    this.render = 'react'
    this.component = ReactTextInputControl

    // we define the props that are passed into the rendered react component here
    this.props = {
      editor,
      name: key,
      label,
      value,
      putData: (key: string, data: unknown) => this.putData(key, data),
    }
  }
}
