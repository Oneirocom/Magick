import { MagickEditor } from '@magickml/core'
import { Connection } from 'rete'

export const removeClassFromNodeConnections = (
  editor: MagickEditor,
  node: any,
  className: string
) => {
  const connections = node.getConnections()

  connections.forEach((connection: Connection) => {
    const connectionView = editor.view.connections.get(connection)

    connectionView.el.className = connectionView.el.className
      .replace(className, '')
      .trim()
  })
}

export const removeClassFromAllConnections = (
  editor: MagickEditor,
  className: string
) => {
  const connections = editor.view.connections

  connections.forEach((connection: any) => {
    connection.el.className = connection.el.className
      .replace(className, '')
      .trim()
  })
}

export const addClassToAllConnections = (
  editor: MagickEditor,
  className: string
) => {
  const connections = editor.view.connections

  connections.forEach((connection: any) => {
    connection.el.className += ` ${className}`
  })
}

export const addClassToNodeConnections = (
  editor: MagickEditor,
  node: any,
  className: string
) => {
  const connections = node.getConnections()

  connections.forEach((connection: Connection) => {
    const connectionView = editor.view.connections.get(connection)

    connectionView.el.className += ` ${className}`
  })
}

export const unselectAllConnections = (editor: MagickEditor) => {
  removeClassFromAllConnections(editor, 'selected')
}

export const selectNodeConnections = (editor: MagickEditor, node: any) => {
  unselectAllConnections(editor)
  addClassToNodeConnections(editor, node, 'selected')
}

export const makeAllConnectionsOpaque = (editor: MagickEditor) => {
  removeClassFromAllConnections(editor, 'transparent')
}

export const makeAllConnectionsTransparent = (editor: MagickEditor) => {
  addClassToAllConnections(editor, 'transparent')
}

export const makeNodeConnectionsOpaque = (editor: MagickEditor, node: any) => {
  removeClassFromNodeConnections(editor, node, 'transparent')
}
