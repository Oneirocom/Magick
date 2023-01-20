import { NodeEditor } from 'rete'

import {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
} from './interfaces'
import { getHook } from './utils'

function install(editor: NodeEditor) {
  editor.on('nodecreated', node =>
    getHook<OnCreated>(editor, node.name, 'created')(node)
  )
  editor.on('noderemoved', node =>
    getHook<OnDestroyed>(editor, node.name, 'destroyed')(node)
  )
  editor.on('connectioncreate', ({ input, output }) => {
    if (
      getHook<OnConnect>(editor, input.node?.name, 'onconnect')(input) ===
        false ||
      getHook<OnConnect>(editor, output.node?.name, 'onconnect')(output) ===
        false
    )
      return false

    return true
  })
  editor.on('connectioncreated', connection => {
    getHook<OnConnected>(
      editor,
      connection.input.node?.name,
      'connected'
    )(connection)
    getHook<OnConnected>(
      editor,
      connection.output.node?.name,
      'connected'
    )(connection)
  })
  editor.on('connectionremove', connection => {
    if (
      getHook<OnDisconnect>(
        editor,
        connection.input.node?.name,
        'ondisconnect'
      )(connection) === false ||
      getHook<OnDisconnect>(
        editor,
        connection.output.node?.name,
        'ondisconnect'
      )(connection) === false
    )
      return false

    return true
  })
  editor.on('connectionremoved', connection => {
    getHook<OnDisconnected>(
      editor,
      connection.input.node?.name,
      'disconnected'
    )(connection)
    getHook<OnDisconnected>(
      editor,
      connection.output.node?.name,
      'disconnected'
    )(connection)
  })
}

export * from './interfaces'
const plugin = {
  name: 'lifecycle',
  install,
}

export default plugin
