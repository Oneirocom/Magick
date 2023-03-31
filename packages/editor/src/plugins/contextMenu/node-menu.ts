// GENERATED 
import { ReactMenu } from '.'
import { createNode, traverse } from './utils'

/**
 * Creates a new NodeMenu class.
 * @returns A NodeMenu class
 */
export default function (): typeof NodeMenu {
  /**
   * NodeMenu class that extends ReactMenu.
   */
  class NodeMenu extends ReactMenu {
    /**
     * NodeMenu constructor.
     * @param {object} editor - The editor instance
     * @param {object} props - Additional properties for the NodeMenu
     * @param {object} nodeItems - A set of key-value pairs for node items
     */
    constructor(editor: any, props: any, nodeItems: any) {
      // Call parent constructor with modified props and node type
      super(editor, { ...props, type: 'node' })

      // Add 'Delete' menu item
      this.addItem('Delete', ({ node }: { node: any }) => editor.removeNode(node))

      // Add 'Clone' menu item
      this.addItem('Clone', async (args: any) => {
        const {
          name,
          position: [x, y],
          ...params
        } = args.node
        const component = editor.components.get(name)
        const node = await createNode(component, {
          ...params,
          x: x + 10,
          y: y + 10,
        })

        editor.addNode(node)
      })

      // Add 'Copy' menu item
      this.addItem('Copy', (args: any) => {
        const pubSub = editor.pubSub
        const tabId = editor.tab.id
        const event = pubSub.events.$MULTI_SELECT_COPY(tabId)
        pubSub.publish(event)
      })

      // Add 'Paste' menu item
      this.addItem('Paste', (args: any) => {
        const pubSub = editor.pubSub
        const tabId = editor.tab.id
        const event = pubSub.events.$MULTI_SELECT_PASTE(tabId)
        pubSub.publish(event)
      })

      // Add additional nodeItems, if any
      traverse(nodeItems, (name: string, func: any, path: string) => this.addItem(name, func, path))
    }
  }

  return NodeMenu
}