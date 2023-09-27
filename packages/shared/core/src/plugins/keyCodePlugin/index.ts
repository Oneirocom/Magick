// DOCUMENTED
/**
 * The `IRunContextEditor` interface specifies the shape of objects that represent a magick editor context.
 * @interface
 */
import { IRunContextEditor, MagickNode } from '../../types'

/**
 * The `install` function installs a 'delete' plugin into a `IRunContextEditor`.
 * When bound, 'delete' will remove the currently-selected node from the editor.
 * @function
 * @param {IRunContextEditor} editor - The editor object to which the plugin is to be attached.
 */
function install(editor: IRunContextEditor) {
  // Bind the 'delete' plugin to the editor object.
  editor.bind('delete')

  // Declare a variable for storing the selected node.
  let currentNode: MagickNode | undefined

  // Set an event listener for the 'nodeselect' event.
  editor.on('nodeselect', (node: MagickNode) => {
    // If the newly-selected node matches the currently-selected node, do nothing.
    if (currentNode && node.id === currentNode.id) return

    // Otherwise, update the value of `currentNode` to the newly-selected node.
    currentNode = node
  })

  // Set an event listener for the 'delete' event.
  editor.on('delete', () => {
    // If no node is currently selected, do nothing.
    if (!currentNode || editor.selected.list.length === 0) return

    console.warn('The delete key has been temporary disabled')

    // Otherwise, remove the selected node from the editor.
    // editor.removeNode(currentNode)
  })
}

// Assign values to a default export object.
const defaultExport = {
  name: 'keycodePlugin',
  install,
}

// Export the default export object.
export default defaultExport
