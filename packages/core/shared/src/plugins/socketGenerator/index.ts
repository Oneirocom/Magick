import Rete, { Input, Output } from '@magickml/rete'

import { AsDataSocket, IRunContextEditor, MagickNode } from '../../types'
import * as sockets from '../../sockets'
import { MagickComponent } from '../../engine'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const builder = component.builder

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node: MagickNode) => {
      const nodeOutputs = AsDataSocket(node.data.outputs)

      // Handle outputs in the nodes data to repopulate when loading from JSON
      if (nodeOutputs && nodeOutputs.length !== 0) {
        const outputMap = {} as Record<string, Output>
        node.outputs.forEach((value, key) => {
          outputMap[key] = value
        })

        nodeOutputs.forEach(socket => {
          if (!outputMap[socket.socketKey]) {
            const output = new Rete.Output(
              socket.socketKey ? socket.socketKey : socket.name,
              socket.name,
              sockets[socket.socketType]
            )
            node.addOutput(output)
          }
        })
      }

      if (nodeOutputs && nodeOutputs.length > 0) {
        component.task.outputs = nodeOutputs.reduce(
          (acc, out) => {
            acc[out.socketKey] = out.taskType || 'output'
            return acc
          },
          { ...component.task.outputs }
        )
      }

      const nodeInputs = AsDataSocket(node.data.inputs)

      if (nodeInputs && nodeInputs.length !== 0) {
        // get inputs from node.inputs
        const inputMap = {} as Record<string, Input>
        node.inputs.forEach((value, key) => {
          inputMap[key] = value
        })

        nodeInputs.forEach(socket => {
          // If the input key is already on the node, return
          if (inputMap[socket.socketKey]) return

          if (socket.hide) return
          const input = new Rete.Input(
            socket.socketKey ? socket.socketKey : socket.name,
            socket.name,
            sockets[socket.socketType],
            socket.socketType === 'triggerSocket'
          )
          node.addInput(input)
        })
      }

      builder.call(component, node)
    }
  })
}

const defaultExport = {
  name: 'socketGenerator',
  install,
}

export default defaultExport
