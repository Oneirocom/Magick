import React from 'react'
import { Control } from 'rete'
const ReactTextInputControl = props => {
  return (
    <p style={{ width: 200, wordBreak: 'break-all' }}>
      Result: {props.display}
    </p>
  )
}

export class DisplayControl extends Control {
  render: string
  component: React.ElementType
  props: { display: string }
  update?: () => void
  constructor({ key, defaultDisplay = '' }) {
    super(key)
    this.render = 'react'
    this.key = key
    this.component = ReactTextInputControl

    // we define the props that are passed into the rendered react component here
    this.props = {
      display: defaultDisplay,
    }
  }

  display(val) {
    const valIsString = typeof val === 'string'

    this.props.display = !valIsString ? JSON.stringify(val) : val

    this.putData('display', !valIsString ? JSON.stringify(val) : val)

    // this is here because the rete library doesnt properly type the update function
    if (this.update) this.update()
  }
}
