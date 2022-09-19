import { Node, Socket, Control } from '@thothai/core'

import Icon, { componentCategories } from '../Icon/Icon'
import css from './Node.module.css'
import icons from '../Icon/icon.module.css'

export class MyNode extends Node {
  props: { node: any; bindSocket: any; bindControl: any }
  state: { outputs: any; controls: any; inputs: any; selected: any }

  render() {
    const { node, bindSocket, bindControl } = this.props
    const { outputs, controls, inputs, selected } = this.state

    const name = node.displayName ? node.displayName : node.name
    const fullName = node.data.name ? `${name} - ${node.data.name}` : name
    const hasError = node.data.error
    const hasSuccess = node.data.success
    const nodeLocked = node.data.nodeLocked

    return (
      <div
        className={`${css['node']} ${css[selected]} ${
          css[hasError ? 'error' : '']
        } ${css[hasSuccess ? 'success' : '']}`}
      >
        {node.deprecated && <div className={css['deprecated-overlay']}></div>}
        {nodeLocked && (
          <div className={`${css['node-locked']} ${icons['node-lock']}`}></div>
        )}
        <div
          className={`${css['node-id']} ${hasError ? css['error'] : ''} ${
            hasSuccess ? css['success'] : ''
          }`}
        >
          <p>{node.id}</p>
        </div>
        <div className={css['node-title']}>
          <Icon
            name={componentCategories[node.category]}
            style={{ marginRight: 'var(--extraSmall)' }}
          />
          {fullName}
          {node.deprecated && (
            <div className={css['node-depricated']}>DEPRECATED</div>
          )}
        </div>
        <div className={css['connections-container']}>
          {inputs.length > 0 && (
            <div className={css['connection-container']}>
              {inputs.map(input => (
                <div className={css['input']} key={input.key}>
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
          )}
          {outputs.length > 0 && (
            <div className={`${css['connection-container']} ${css['out']}`}>
              {outputs.map(output => (
                <div className={css['output']} key={output.key}>
                  <div className="output-title">{output.name}</div>
                  <Socket
                    type="output"
                    socket={output.socket}
                    io={output}
                    innerRef={bindSocket}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={css['bottom-container']}>
          {/* Controls */}
          {controls.map(control => (
            <Control
              className={css['control']}
              key={control.key}
              control={control}
              innerRef={bindControl}
            />
          ))}
        </div>
      </div>
    )
  }
}
