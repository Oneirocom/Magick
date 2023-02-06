// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { Control } from 'rete'

const ReactTextInputControl = props => {
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
    <>
      {props.label && <label htmlFor="">{props.label}</label>}
      <input
        type="text"
        value={value}
        style={{ marginTop: 'var((--c1)' }}
        onChange={onChange}
      />
    </>
  )
}

export class TextInputControl extends Control {
  constructor({ editor, key, value, ...rest }) {
    super(key)
    this.render = 'react'
    this.component = ReactTextInputControl

    const label = rest.label || null

    // we define the props that are passed into the rendered react component here
    this.props = {
      editor,
      name: key,
      label,
      value,
      putData: (...args) => this.putData.apply(this, args),
    }
  }
}
