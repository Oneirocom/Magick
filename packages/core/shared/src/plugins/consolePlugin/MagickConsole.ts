import { NodeView } from 'rete/types/view/node'
import { MagickComponent } from '../../engine'
import { IRunContextEditor, MagickNode } from '../../types'

type ConsoleConstructor = {
  component: MagickComponent<unknown>
  editor: IRunContextEditor
  node: MagickNode
  server: boolean
  throwError?: (error: unknown) => void
  isEngine?: boolean
}

export type Message = {
  from: string
  nodeId: number
  name: string | null
  content?: string
  type: 'error' | 'log'
}

interface OutputError {
  output: {
    error: string
  }
}
function isOutputError(value: unknown): value is OutputError {
  return (
    !!value &&
    !!(value as OutputError).output &&
    !!(value as OutputError).output.error
  )
}
export class MagickConsole {
  node: MagickNode
  editor: IRunContextEditor
  component: MagickComponent<unknown>
  nodeView?: NodeView
  isServer: boolean
  throwError?: (error: unknown) => void
  isEngine: boolean

  constructor({
    component,
    editor,
    node,
    server,
    throwError,
    isEngine = false,
  }: ConsoleConstructor) {
    this.component = component
    this.editor = editor
    this.node = node
    this.isServer = server
    this.isEngine = isEngine

    if (throwError) this.throwError = throwError
    if (server || isEngine) return

    const nodeValues = Array.from(editor.view.nodes)
    const foundNode = nodeValues.find(([, n]) => n.node.id === node.id)

    if (!foundNode) return

    this.nodeView = foundNode[1]
  }

  updateNodeView() {
    if (!this.nodeView) return
    this.nodeView.onStart()
    this.nodeView.node.update()
  }

  formatMessage(_message: string, type: 'error' | 'log'): Message {
    return {
      from: this.node.name ?? this.component.name,
      nodeId: this.node.id,
      name: (this.node?.data?.name as string) ?? null,
      content: _message,
      type,
    }
  }

  formatErrorMessage(error: Error) {
    return this.formatMessage(error.message, 'error')
  }

  renderError() {
    if (this.isEngine) return
    this.node.data.error = true
    this.updateNodeView()
    this.node.data.error = false
  }

  renderLog() {
    this.node.data.success = true
    this.updateNodeView()
    this.node.data.success = false
  }

  log(_message: unknown) {
    if (this.isServer) return

    const message =
      typeof _message !== 'string' ? JSON.stringify(_message) : _message
    this.sendToDebug(this.formatMessage(message, 'log'))
    if (isOutputError(_message)) {
      this.renderError()
    } else {
      this.renderLog()
    }
  }

  error(_message: unknown) {
    this.throwServerError(_message)

    const message =
      typeof _message !== 'string' ? JSON.stringify(_message) : _message

    if (!this.isServer) {
      console.log('Error', _message)
      this.sendToDebug(this.formatMessage(message, 'error'))
      this.renderError()
    }
  }

  sendSuccess(result: unknown) {
    console.log('Success', result)
  }

  sendToDebug(message: unknown) {
    if (this.editor && this.editor.context && this.editor.context.sendToDebug)
      this.editor.context.sendToDebug(message)
  }

  throwServerError(message: unknown) {
    if (this.isServer && this.throwError) this.throwError(message)
  }
}
