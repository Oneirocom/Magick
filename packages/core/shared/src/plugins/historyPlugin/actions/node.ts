// DOCUMENTED
import { Node, NodeEditor } from 'shared/rete'
import Action from '../action'

/**
 * Base class for actions related to Node operations
 */
abstract class NodeAction extends Action {
  protected editor: NodeEditor
  protected node: Node

  /**
   * @param editor Instance of NodeEditor
   * @param node Node instance
   */
  constructor(editor: NodeEditor, node: Node) {
    super()
    this.editor = editor
    this.node = node
  }
}

/**
 * AddNode action class
 */
export class AddNodeAction extends NodeAction {
  /**
   * Undo the action by removing the node.
   */
  undo() {
    this.editor.removeNode(this.node)
  }

  /**
   * Redo the action by adding the node.
   */
  redo() {
    this.editor.addNode(this.node)
  }
}

/**
 * RemoveNode action class
 */
export class RemoveNodeAction extends NodeAction {
  /**
   * Undo the action by adding the node.
   */
  undo() {
    this.editor.addNode(this.node)
  }

  /**
   * Redo the action by removing the node.
   */
  redo() {
    this.editor.removeNode(this.node)
  }
}

/**
 * DragNode action class
 */
export class DragNodeAction extends NodeAction {
  prev: { x: number; y: number }
  new: { x: number; y: number }

  /**
   * @param editor Instance of NodeEditor
   * @param node Node instance
   * @param prev Previous position as [number, number]
   */
  constructor(editor: NodeEditor, node: Node, prev: [number, number]) {
    super(editor, node)

    this.prev = { x: prev[0], y: prev[1] }
    this.new = { x: node.position[0], y: node.position[1] }
  }

  /**
   * Translate the node's position
   * @param position Position with x and y coordinates.
   */
  private _translate(position: { x: number; y: number }) {
    const node = this.editor.view.nodes.get(this.node)
    if (node === undefined) {
      return console.error('Node not found in editor view')
    }
    node.translate(position.x, position.y)
  }

  /**
   * Undo the action by updating the position to previous.
   */
  undo() {
    this._translate(this.prev)
  }

  /**
   * Redo the action by updating the position to new.
   */
  redo() {
    this._translate(this.new)
  }

  /**
   * Update the action by setting new position.
   * @param Node Node instance
   */
  update(node: Node) {
    this.new = { x: node.position[0], y: node.position[1] }
  }
}
