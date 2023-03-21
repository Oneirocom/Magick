import { ReactMenu } from '.'
import { createNode, traverse } from './utils'

export default function () {
  return class NodeMenu extends ReactMenu {
    constructor(editor, props, nodeItems) {
      super(editor, {...props, type: 'node'})

      this.addItem('Delete', ({ node }) => editor.removeNode(node))
      this.addItem('Clone', async args => {
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

      this.addItem('Copy', args => {
        const pubSub = editor.pubSub
        const tabId = editor.tab.id
        const event = pubSub.events.$MULTI_SELECT_COPY(tabId)
        pubSub.publish(event)
      })

      this.addItem('Paste', args => {
        const pubSub = editor.pubSub
        const tabId = editor.tab.id
        const event = pubSub.events.$MULTI_SELECT_PASTE(tabId)
        pubSub.publish(event)
      })

      traverse(nodeItems, (name, func, path) => this.addItem(name, func, path))
    }
  }
}
