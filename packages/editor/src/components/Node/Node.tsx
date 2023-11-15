// DOCUMENTED
import { Node } from '../../plugins/reactRenderPlugin/Node'
import { Socket } from '../../plugins/reactRenderPlugin/Socket'
import { Control } from '../../plugins/reactRenderPlugin/Control'
import { Upload } from '../../plugins/reactRenderPlugin/Upload'
import { Tooltip } from '@mui/material'
import { Icon, componentCategories } from '@magickml/client-core'
import css from './Node.module.css'
import { styled } from '@mui/material/styles'

// Define the priorities
const priorityConfig = {
  socketTypes: ['Trigger', 'Event', 'String'], // Add all known socket types here in order of priority
  socketNames: ['content'] // Add all known socket names here in order of priority
};

// Function to get the index of a socket name or type from the priority configuration; if not found, return a large index number
const getPriorityIndex = (value: string, type: 'socketTypes' | 'socketNames') => {
  const index = priorityConfig[type].indexOf(value);
  return index === -1 ? 999 : index; // If the item is not found, assign a large index number to sort it to the end
};

// Sorting function using the priority configuration
const sortSockets = (a: any, b: any) => {
  // Compare socket types using their priority
  const typePriorityA = getPriorityIndex(a.socket.name, 'socketTypes');
  const typePriorityB = getPriorityIndex(b.socket.name, 'socketTypes');

  if (typePriorityA !== typePriorityB) {
    return typePriorityA - typePriorityB;
  }

  // If types are the same, compare socket names using their priority
  const namePriorityA = getPriorityIndex(a.name, 'socketNames');
  const namePriorityB = getPriorityIndex(b.name, 'socketNames');

  if (namePriorityA !== namePriorityB) {
    return namePriorityA - namePriorityB;
  }

  // If priorities are the same, sort by name alphabetically
  return a.name.localeCompare(b.name);
};

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
    const StyleTooltip = styled(Tooltip)`
    width: initial;
    `

    return (
      <div
        className={`${css['node']} ${css[selected]} ${css[hasError ? 'error' : '']
          } ${css[hasSuccess ? 'success' : '']}`}
      >
        <div
          className={`${css['node-id']} ${hasError ? css['error'] : ''} ${hasSuccess ? css['success'] : ''
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
              {inputs.sort(sortSockets).map(input => (
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
                    <StyleTooltip
                      title={`Input:${input.name}`}
                      placement="left"
                      enterNextDelay={500}
                      disableInteractive
                    >
                      <div className="input-title">{input.name}</div>
                    </StyleTooltip>
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
              {outputs.sort(sortSockets).map(output => (
                <div className={css['output']} key={output.key}>
                  {typeof output != 'undefined' &&
                    output.connections.forEach(element => {
                      element.data = { ...element.data, hello: 'hello' }
                    })}
                  <StyleTooltip
                    title={`output: ${output.name}`}
                    placement="right"
                    enterNextDelay={500}
                    disableInteractive
                  >
                    <div className="output-title">{output.name}</div>
                  </StyleTooltip>

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
