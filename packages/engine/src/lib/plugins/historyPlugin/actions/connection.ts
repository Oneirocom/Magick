import { Connection, NodeEditor } from 'rete'
import Action from '../action'

// The saved connection may have been removed and recreated, so make sure we are working with the correct reference
function findNewConnection(oldConnection) {
  const { input, output } = oldConnection

  return output.connections.find(c => c.input === input)
}

class ConnectionActionHelper {
  editor:NodeEditor<any>
  connection:Connection
  constructor(editor:NodeEditor<any>, connection:Connection) {
    this.editor = editor
    this.connection = connection
  }

  add() {
    this.editor.connect(this.connection.output, this.connection.input)
  }

  remove() {
    this.editor.removeConnection(findNewConnection(this.connection))
  }
}

export class AddConnectionAction extends Action {
  helper:ConnectionActionHelper
  constructor(editor, connection) {
    super()
    this.helper = new ConnectionActionHelper(editor, connection)
  }

  undo() {
    this.helper.remove()
  }

  redo() {
    this.helper.add()
  }
}

export class RemoveConnectionAction extends Action {
  helper:ConnectionActionHelper
  constructor(editor, connection) {
    super()
    this.helper = new ConnectionActionHelper(editor, connection)
  }

  undo() {
    this.helper.add()
  }

  redo() {
    this.helper.remove()
  }
}
