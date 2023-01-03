import { NodeView } from 'rete/types/view/node'

import { IRunContextEditor, NodeData } from '../../../types'
import { ThothComponent } from '../../thoth-component'

type ConsoleConstructor = {
  component: ThothComponent<unknown>
  editor: IRunContextEditor
  node: NodeData
  server: boolean
  throwError?: Function
  isEngine?: boolean
}

export type Message = {
  from: string
  nodeId: number
  name: string | null
  content?: string
  type: 'error' | 'log'
}

export class ThothConsole {
  node: NodeData
  editor: IRunContextEditor
  component: ThothComponent<unknown>
  nodeView: NodeView
  isServer: boolean
  throwError?: Function
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

    this.nodeView = foundNode[1] as any
  }

  updateNodeView() {
    if (!this.nodeView) return
    this.nodeView.onStart()
    this.nodeView.node.update()
  }

  formatMessage(_message: string, type: 'error' | 'log'): Message {
    return {
      from: this.node.name,
      nodeId: this.node.id,
      name: (this.node?.data?.name as string) ?? null,
      content: _message,
      type,
    }
  }

  formatErrorMessage(error: any) {
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

  log(_message: any) {
    if (this.isServer) return

    const message =
      typeof _message !== 'string' ? JSON.stringify(_message) : _message
    this.sendToDebug(this.formatMessage(message, 'log'))
    this.renderLog()
  }

  error(error: any) {
    const message = this.formatErrorMessage(error)
    this.throwServerError(message)

    if (!this.isServer) {
      this.sendToDebug(message)
      this.renderError()
    }
  }

  sendSuccess(result: any) {
    console.log('Success', result)
  }

  sendToDebug(message: any) {
    if (this.editor && this.editor.thoth && this.editor.thoth.sendToDebug)
      this.editor.thoth.sendToDebug(message)
  }

  throwServerError(message: any) {
    if (this.isServer && this.throwError) this.throwError(message)
  }
}
