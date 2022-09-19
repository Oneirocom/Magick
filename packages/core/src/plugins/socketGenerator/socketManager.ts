import { GraphData, DataSocketType, ThothNode } from '../../types'
import { ThothEditor } from '../../editor'
import { ModuleSocketType } from '../modulePlugin/module-manager'

export default class SocketManager {
  node: ThothNode
  editor: ThothEditor
  nodeOutputs: DataSocketType[] = []
  inputs: ModuleSocketType[]
  outputs: ModuleSocketType[]
  triggerOuts: ModuleSocketType[]
  triggerIns: ModuleSocketType[]

  constructor(node: ThothNode, editor: ThothEditor) {
    this.editor = editor
    this.node = node
  }

  initializeNode() {
    if (!this.node.data.inputs) this.node.data.inputs = []
    if (!this.node.data.outputs) this.node.data.outputs = []
  }

  updateSocketsFromChain() {}

  regenerateSockets() {}
}
