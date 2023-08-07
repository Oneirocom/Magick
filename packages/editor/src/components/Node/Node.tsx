// DOCUMENTED
import { Node } from '../../plugins/reactRenderPlugin/Node'
import { Socket } from '../../plugins/reactRenderPlugin/Socket'
import { Control } from '../../plugins/reactRenderPlugin/Control'
import { Upload } from '../../plugins/reactRenderPlugin/Upload'
import { Tooltip } from '@mui/material'
import { Icon, componentCategories } from '@magickml/client-core'
import css from './Node.module.css'
import styled from '@emotion/styled'

/**
 * Custom Node component for rendering nodes with specific functionality.
 * Inherits from the base Node class.
 */
export class MyNode extends Node {
  declare props: any
  declare state: any

  /**
   * Constructor for the MyNode component.
   * @param props - Properties that are passed to the component.
   */
  constructor(props) {
    super(props)
    this.state = {
      outputs: [],
      controls: [],
      inputs: [],
      selected: false,
    }
  }

  /**
   * Renders the MyNode component.
   * @returns The JSX representation of the component.
   */
  render() {
    const { node, bindSocket, bindControl, editor } = this.props
    const { outputs, controls, inputs, selected } = this.state
    const name = node.displayName ? node.displayName : node.name
    const fullName = node.data.name ?? name
    const hasError = node.data.error
    const hasSuccess = node.data.success
    const img_url = node.data.image
    const html = node.data.func

    const handleMouseEnter = socket => {
      socket.connections.forEach(connection => {
        const el = editor.view.connections.get(connection).el
        el.classList.add('selected')
      })
    }

    const handleMouseLeave = socket => {
      socket.connections.forEach(connection => {
        const el = editor.view.connections.get(connection).el
        el.classList.remove('selected')
      })
    }

    const StyledToolTip = styled(Tooltip)` 
      pointer-events: none;
    `; 

    return (
      <div
        className={`${css['node']} ${css[selected]} ${
          css[hasError ? 'error' : '']
        } ${css[hasSuccess ? 'success' : '']}`}
      >
        <div
          className={`${css['node-id']} ${hasError ? css['error'] : ''} ${
            hasSuccess ? css['success'] : ''
          }`}
        >
          <p>{node.id}</p>
        </div>
        <div className={css['node-title-container']}>
          <div className={css['node-title']}>
            <Icon
              name={componentCategories[node.category]}
              style={{ marginRight: 'var(--extraSmall)' }}
            />
            {fullName}
          </div>
        </div>
        <div className={css['connections-container']}>
          {html !== undefined && (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
          {img_url !== undefined && (
            <Upload output={outputs} id_image={img_url} />
          )}
          {inputs.length > 0 && (
            <div className={css['connection-container']}>
              {inputs.map(input => (
                <div className={css['input']} key={input.key}>
                  <div
                    onMouseEnter={() => handleMouseEnter(input)}
                    onMouseLeave={() => handleMouseLeave(input)}
                  >
                    <Socket
                      type="input"
                      socket={input.socket}
                      io={input}
                      innerRef={bindSocket}
                    />
                  </div>
                  {!input.showControl() && (
                    <StyledToolTip
                      title={`Input:${input.name}`}
                      placement="left"
                      enterDelay={500}
                    >
                      <div className="input-title">{input.name}</div>
                    </StyledToolTip>
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
                  {typeof output != 'undefined' &&
                    output.connections.forEach(element => {
                      element.data = { ...element.data, hello: 'hello' }
                    })}
                  <StyledToolTip
                    title={`output: ${output.name}`}
                    placement="right"
                    enterDelay={500}
                  >
                    <div className="output-title">{output.name}</div>
                  </StyledToolTip>

                  <div
                    onMouseEnter={() => handleMouseEnter(output)}
                    onMouseLeave={() => handleMouseLeave(output)}
                  >
                    <Socket
                      type="output"
                      socket={output.socket}
                      io={output}
                      innerRef={bindSocket}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

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
