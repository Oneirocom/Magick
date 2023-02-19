/* eslint-disable sort-imports */
/* eslint-disable react/prop-types */
import React from 'react'

import { Control } from './Control'
import { Socket } from './Socket'
import { kebab } from './utils'
import './styles.css'

export class Node extends React.Component {
  state = {}

  static getDerivedStateFromProps({ node, editor }) {
    return {
      outputs: Array.from(node.outputs.values()),
      controls: Array.from(node.controls.values()),
      inputs: Array.from(node.inputs.values()),
      selected: editor.selected.contains(node) ? 'selected' : '',
    }
  }

  render() {
    const { node, bindSocket, bindControl } = this.props
    const { outputs, controls, inputs, selected } = this.state

    return (
      <div className={`node ${selected} ${kebab(node.name)}`}>
        <div className="title">{node.name}</div>
        {/* Outputs */}
        {outputs.map(output => (
          <div className="output" key={output.key}>
            <div className="output-title">{output.name}</div>
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
        {/* Controls */}
        {controls.map(control => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
        {/* Inputs */}
        {inputs.map(input => (
          <div className="input" key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
      </div>
    )
  }
}
