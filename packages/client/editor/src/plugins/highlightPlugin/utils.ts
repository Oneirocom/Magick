import { MagickEditor } from '@magickml/core'
import { Connection } from 'shared/rete'

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

export const addPathGlowToNode = (editor: MagickEditor, node: any) => {
  const connections = node.getConnections()

  connections.forEach((connection: Connection) => {
    const connectionView = editor.view.connections.get(connection)

    // get main path from inside connection el
    const path = connectionView.el.querySelector('.main-path')

    path.setAttribute('filter', 'url(#glow)')
  })
}

export const removePathGlowFromNode = (editor: MagickEditor, node: any) => {
  const connections = node.getConnections()

  connections.forEach((connection: Connection) => {
    const connectionView = editor.view.connections.get(connection)

    // get main path from inside connection el
    const path = connectionView.el.querySelector('.main-path')

    path.setAttribute('filter', '')
  })
}

export const removePathGlowFromAllConnections = (editor: MagickEditor) => {
  const connections = editor.view.connections

  connections.forEach((connection: any) => {
    // get main path from inside connection el
    const path = connection.el.querySelector('.main-path')

    path.setAttribute('filter', '')
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
