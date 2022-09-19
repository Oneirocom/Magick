// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from 'react'
import { Control } from 'rete'
const ReactTextInputControl = props => {
  return <p style={{ width: 200, wordBreak:'break-all' }}>Result: {props.display}</p>
}

export class DisplayControl extends Control {
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
    const displayVal = typeof val === 'string' ? val : JSON.stringify(val)

    this.props.display = displayVal
    this.putData('display', displayVal)
    this.update()
  }
}
