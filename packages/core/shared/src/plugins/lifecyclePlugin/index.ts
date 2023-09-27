// DOCUMENTED
/**
 * Imports Required for the Plugin
 */
import { NodeEditor } from 'shared/rete'

import {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
} from './interfaces'
import { getHook } from './utils'

/**
 * @function install
 * @description Function to install the lifecycle hooks plugin to the rete editor instance
 * @param editor Instance of the rete editor
 */
function install(editor: NodeEditor) {
  editor.on('nodecreated', node => {
    getHook<OnCreated>(editor, node.name, 'created')(node)
  })

  editor.on('noderemoved', node => {
    getHook<OnDestroyed>(editor, node.name, 'destroyed')(node)
  })

  editor.on('connectioncreate', ({ input, output }) => {
    const isInputNodeValid =
      getHook<OnConnect>(editor, input.node?.name, 'onconnect')(input) !== false
    const isOutputNodeValid =
      getHook<OnConnect>(editor, output.node?.name, 'onconnect')(output) !==
      false

    return isInputNodeValid && isOutputNodeValid
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
    const isInputNodeValid =
      getHook<OnDisconnect>(
        editor,
        connection.input.node?.name,
        'ondisconnect'
      )(connection) !== false

    const isOutputNodeValid =
      getHook<OnDisconnect>(
        editor,
        connection.output.node?.name,
        'ondisconnect'
      )(connection) !== false

    return isInputNodeValid && isOutputNodeValid
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

/**
 * Exporting all the interfaces
 */
export * from './interfaces'

/**
 * Lifecycle Plugin
 */
const plugin = {
  name: 'lifecycle',
  install,
}

export default plugin
