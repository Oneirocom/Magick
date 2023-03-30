import { Node, NodeEditor } from 'rete'
import Action from '../action'

abstract class NodeAction extends Action {
  protected editor: NodeEditor
  protected node: Node
  constructor(editor, node) {
    super()
    this.editor = editor
    this.node = node
  }
}

export class AddNodeAction extends NodeAction {
  undo() {
    this.editor.removeNode(this.node)
  }

  redo() {
    this.editor.addNode(this.node)
  }
}

export class RemoveNodeAction extends NodeAction {
  undo() {
    this.editor.addNode(this.node)
  }

  redo() {
    this.editor.removeNode(this.node)
  }
}

export class DragNodeAction extends NodeAction {
  prev: [number, number]
  new: [number, number]
  constructor(editor: NodeEditor, node: Node, prev: [number, number]) {
    super(editor, node)

    this.prev = [...prev]
    this.new = [...node.position]
  }

  _translate(position) {
    const node = this.editor.view.nodes.get(this.node)
    //TODO: maybe just return if node is undefined?
    if (node === undefined) return console.error('Node not found in editor view')
    node.translate(position.x, position.y)
  }

  undo() {
    this._translate(this.prev)
  }

  redo() {
    this._translate(this.new)
  }

  update(node: Node) {
    this.new = [...node.position]
  }
}
