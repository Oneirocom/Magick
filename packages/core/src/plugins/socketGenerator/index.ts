import Rete, { Input, Output } from 'rete'

import { DataSocketType, IRunContextEditor, ThothNode } from '../../../types'
import * as sockets from '../../sockets'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: any) => {
    const builder = component.builder

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node: ThothNode) => {
      const nodeOutputs = node.data.outputs as DataSocketType[]

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

      const nodeInputs = node.data.inputs as DataSocketType[]

      if (nodeInputs && nodeInputs.length !== 0) {
        // get inputs from node.inputs
        const inputMap = {} as Record<string, Input>
        node.inputs.forEach((value, key) => {
          inputMap[key] = value
        })

        nodeInputs.forEach(socket => {
          // If the input key is already on the node, return
          if (inputMap[socket.socketKey]) return
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
