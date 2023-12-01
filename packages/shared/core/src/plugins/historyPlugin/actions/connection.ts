// DOCUMENTED
import { Connection, NodeEditor } from 'shared/rete'
import Action from '../action'

/**
 * Finds the new connection by matching the input and output of the old connection.
 * @param {Connection} oldConnection - The old connection to find the new one.
 * @returns {Connection} The new connection found.
 */
function findNewConnection(oldConnection: Connection): Connection {
  const { input, output } = oldConnection

  return output.connections.find(c => c.input === input) as Connection
}

/**
 * ConnectionActionHelper class to handle adding and removing connections.
 */
class ConnectionActionHelper {
  editor: NodeEditor
  connection: Connection

  /**
   * Constructs a ConnectionActionHelper instance.
   * @param {NodeEditor} editor - The editor instance.
   * @param {Connection} connection - The connection to work with.
   */
  constructor(editor: NodeEditor, connection: Connection) {
    this.editor = editor
    this.connection = connection
  }

  /**
   * Adds the connection to the editor.
   */
  add(): void {
    this.editor.connect(this.connection.output, this.connection.input)
  }

  /**
   * Removes the connection from the editor.
   */
  remove(): void {
    this.editor.removeConnection(findNewConnection(this.connection))
  }
}

/**
 * AddConnectionAction class for undoing and redoing adding a connection.
 */
export class AddConnectionAction extends Action {
  helper: ConnectionActionHelper

  /**
   * Constructs an AddConnectionAction instance.
   * @param {NodeEditor} editor - The editor instance.
   * @param {Connection} connection - The connection to work with.
   */
  constructor(editor: NodeEditor, connection: Connection) {
    super()
    this.helper = new ConnectionActionHelper(editor, connection)
  }

  /**
   * Undoes the connection addition.
   */
  undo(): void {
    this.helper.remove()
  }

  /**
   * Redoes the connection addition.
   */
  redo(): void {
    this.helper.add()
  }
}

/**
 * RemoveConnectionAction class for undoing and redoing removing a connection.
 */
export class RemoveConnectionAction extends Action {
  helper: ConnectionActionHelper

  /**
   * Constructs a RemoveConnectionAction instance.
   * @param {NodeEditor} editor - The editor instance.
   * @param {Connection} connection - The connection to work with.
   */
  constructor(editor: NodeEditor, connection: Connection) {
    super()
    this.helper = new ConnectionActionHelper(editor, connection)
  }

  /**
   * Undoes the connection removal.
   */
  undo(): void {
    this.helper.add()
  }

  /**
   * Redoes the connection removal.
   */
  redo(): void {
    this.helper.remove()
  }
}
