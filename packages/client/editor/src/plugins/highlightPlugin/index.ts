import { Connection } from '@magickml/rete'
import {
  makeAllConnectionsOpaque,
  makeAllConnectionsTransparent,
  makeNodeConnectionsOpaque,
  removePathGlowFromAllConnections,
  selectNodeConnections,
  unselectAllConnections,
} from './utils'

type DataType = {
  connection: Connection
  el: HTMLElement
}

function install(editor, params) {
  // editor.on('rendersocket', ({ el, input, output, socket }) => {
  //   console.log('Editor', editor)
  //   console.log('SOCKET', socket)
  //   console.log('INPUT', input?.connections)
  // })

  editor.on('renderconnection', ({ connection, el }: DataType) => {
    const inputName = connection.input.socket.name
    const outputName = connection.output.socket.name

    el.className += ' connection-wrapper'

    if (inputName === 'Any' && outputName === 'Any') {
      el.className += ' any'
    }

    if (inputName === 'String' || outputName === 'String') {
      el.className += ' string'
    }

    if (inputName === 'Number' || outputName === 'Number') {
      el.className += ' number'
    }

    if (inputName === 'Boolean' || outputName === 'Boolean') {
      el.className += ' boolean'
    }

    if (inputName === 'Object' || outputName === 'Object') {
      el.className += ' object'
    }

    if (inputName === 'Array' || outputName === 'Array') {
      el.className += ' array'
    }

    if (inputName === 'Trigger' || outputName === 'Trigger') {
      el.className += ' trigger'
    }

    if (inputName === 'Event' || outputName === 'Event') {
      el.className += ' event'
    }
  })

  editor.on('nodeselect', node => {
    // unselect all connections first from connection Map
    unselectAllConnections(editor)
    makeAllConnectionsOpaque(editor)
    removePathGlowFromAllConnections(editor)

    // select all connections from node
    selectNodeConnections(editor, node)
    makeAllConnectionsTransparent(editor)
    makeNodeConnectionsOpaque(editor, node)
    // addPathGlowToNode(editor, node)
  })

  // Make sure to unselect all connections when clicking on the editor
  editor.on('click', () => {
    unselectAllConnections(editor)
    makeAllConnectionsOpaque(editor)
    // removePathGlowFromAllConnections(editor)
  })
}

const plugin = {
  name: 'HighlightPlugin',
  install,
}

export default plugin
