import { MagickComponent } from '../../engine'
import { IRunContextEditor, MagickNode } from '../../types'
import { HandleDataArgs, Inspector } from './Inspector'

function install(editor: IRunContextEditor) {
  const { onInspector, sendToInspector, clearTextEditor } = editor.context

  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const builder = component.builder

    if (!component.info)
      return console.error(
        'All components must contain an info property describing the component to the end user.'
      )

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node: MagickNode) => {
      // This will unsubscribe us
      // if (node.subscription) node.subscription()
      // Inspector class which will handle regsistering data controls, serializing, etc.
      node.inspector = new Inspector({ component, editor, node })

      // Adding category to node for display on node`
      node.category = component.category

      node.displayName = component.displayName

      node.info = component.info

      // here we attach the default info control to the component which will show up in the inspector

      if (!onInspector) return

      node.subscription = onInspector(node, (data) => {
        node.inspector.handleData(data as HandleDataArgs)
        editor.trigger('nodecreated', node)
        // NOTE might still need this.  Keep an eye out.
        // sendToInspector(node.inspector.data());
      })

      builder.call(component, node)
    }
  })

  let currentNode: MagickNode | undefined

  // handle publishing and subscribing to inspector
  editor.on('nodeselect', (node: MagickNode) => {
    if (currentNode && node.id === currentNode.id) return
    if (!clearTextEditor || !sendToInspector) return
    currentNode = node
    clearTextEditor()
    sendToInspector(node.inspector.data())
  })
}

export { DataControl } from './DataControl'

const defaultExport = {
  name: 'inspector',
  install,
}

export default defaultExport
