import { IRunContextEditor, ThothNode } from '../../../types'

function install(editor: IRunContextEditor) {
  editor.bind('delete')

  let currentNode: ThothNode | undefined

  editor.on('nodeselect', (node: ThothNode) => {
    if (currentNode && node.id === currentNode.id) return
    currentNode = node
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor.on('delete', () => {
    if (!currentNode) return
    editor.removeNode(currentNode)
  })
}

const defaultExport = {
  name: 'keycodePlugin',
  install,
}

export default defaultExport
