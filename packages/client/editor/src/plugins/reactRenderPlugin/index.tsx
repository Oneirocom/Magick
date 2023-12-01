// DOCUMENTED
import React from 'react'
import ReactDOM from 'react-dom'
import { Node } from './Node'

const SUPPRESSED_WARNINGS = ['ReactDOM.render']
const consoleError = console.error

/**
 * Filter warnings to suppress specific warnings while keeping others
 */
console.error = function filterWarnings(msg, ...args) {
  if (
    typeof msg === 'string' &&
    SUPPRESSED_WARNINGS.some(entry => msg.includes(entry))
  ) {
    return
  }

  consoleError(msg, ...args)
}
/**
 * Types of options for ReactRenderPlugin
 */
export type ReactRenderPluginOptions = {
  component?: Node
  createRoot?: Function
}

/**
 * Install the ReactRenderPlugin with given options
 */
function install(editor, { component: NodeComponent = Node, createRoot }) {
  const roots = new Map()
  const render = createRoot
    ? (element, container) => {
        if (!roots.has(container)) roots.set(container, createRoot(container))
        const root = roots.get(container)

        root.render(element)
      }
    : ReactDOM.render

  // Handle rendering nodes
  editor.on(
    'rendernode',
    ({ el, node, component, bindSocket, bindControl }) => {
      if (component.render && component.render !== 'react') return
      const Component = component.component || NodeComponent

      node.update = () =>
        new Promise<void>(resolve => {
          render(
            (
              <Component
                node={node}
                editor={editor}
                bindSocket={bindSocket}
                bindControl={bindControl}
              />
            ) as any,
            el,
            () => resolve()
          )
        })
      node._reactComponent = true
      node.update()
    }
  )

  // Handle rendering controls
  editor.on('rendercontrol', ({ el, control }) => {
    if (control.render && control.render !== 'react') return
    const Component = control.component

    control.update = () =>
      new Promise<void>(res => {
        render(<Component {...control.props} />, el, res)
      })
    control.update()
  })

  // Update affected nodes for connection created or removed
  editor.on('connectioncreated connectionremoved', connection => {
    connection.output.node.update()
    connection.input.node.update()
  })

  // Update nodes when node is selected
  editor.on('nodeselected', () => {
    editor.nodes.filter(n => n._reactComponent).map(node => node.update())
  })
}

export { Node } from './Node'
export { Socket } from './Socket'
export { Control } from './Control'

/** Exports the ReactRenderPlugin with name and install function **/
export default {
  name: 'react-render',
  install,
}
