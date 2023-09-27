// DOCUMENTED
import { MagickComponent } from '../../engine'
import { IRunContextEditor, MagickNode } from '../../types'
import { HandleDataArgs, Inspector } from './Inspector'

/**
 * Install the inspector plugin to the editor
 * @param {IRunContextEditor} editor - The editor instance where the plugin will be installed
 */
function install(editor: IRunContextEditor): void {
  const { onInspector, sendToInspector, clearTextEditor } = editor.context

  // Register a new component
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const builder = component.builder

    if (!component.info)
      return console.error(
        'All components must contain an info property describing the component to the end user.'
      )

    // Override the default builder with a custom one, invoking the original builder inside it
    component.builder = (node: MagickNode) => {
      // Initialize an Inspector instance to handle registering data controls, serialization, etc.
      node.inspector = new Inspector({ component, editor, node })

      // Set node properties
      node.category = component.category
      node.displayName = component.displayName
      node.info = component.info

      // Attach the default info control to the component to display in the inspector
      if (onInspector) {
        node.subscription = onInspector(node, data => {
          node.inspector.handleData(data as HandleDataArgs)
          editor.trigger('nodecreated', node)
        })
      }

      // Call the original builder
      builder.call(component, node)
    }
  })

  let currentNode: MagickNode | undefined

  // Handle publishing and subscribing to the inspector
  editor.on('nodeselect', (node: MagickNode) => {
    // Do nothing if the selected node is the same as the current one
    if (currentNode && node.id === currentNode.id) return
    if (!clearTextEditor || !sendToInspector) return

    // Update the current node and clear the text editor
    currentNode = node
    clearTextEditor()
    sendToInspector(node.inspector.data())
  })
}

export { DataControl } from './DataControl'

// Default export object
const defaultExport = {
  name: 'inspector',
  install,
}

export default defaultExport
