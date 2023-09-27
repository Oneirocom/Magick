// DOCUMENTED
import Rete from 'shared/rete'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../engine'
import * as sockets from '../../sockets'
import { SocketNameType } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `Takes an input of any type and casts it into the selected output type. Be sure to know the type of your input as it might throw an error if the object cannot be cast to your selected type.`

/**
 * the Cast class is used to create a cast component
 * that casts any socket into another socket type.
 */
export class Cast extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super(
      'Cast',
      { outputs: { trigger: 'option', output: 'output' } },
      'Utility',
      info
    )
  }

  /**
   * Adds a castable socket to the node.
   * @param node - The MagickNode to add the castable socket to.
   * @param name - The socket name type.
   */
  addSocket(node: MagickNode, name: SocketNameType) {
    const key = sockets.socketNameMap[name]
    const output = sockets[key]
    const socket = new Rete.Output('output', name, output)
    const oldOutputKey = Array.from(node.outputs.keys())[0]
    const oldOutput = node.outputs.get(oldOutputKey)
    node.data.name = name

    const connection = node
      .getConnections()
      .filter(con => con['output'].key === oldOutputKey)[0]

    if (connection) node.inspector.editor.removeConnection(connection)
    if (oldOutput) {
      node.removeOutput(oldOutput)
      node.outputs.clear()
    }

    node.addOutput(socket)
  }

  /**
   * Builds the MagickNode for the Cast component.
   * @param node - The MagickNode to build.
   * @returns - The built MagickNode.
   */
  builder(node: MagickNode): MagickNode {
    const input = new Rete.Input('input', 'Input', sockets.anySocket, true)
    const output = new Rete.Output('output', 'Output', sockets.anySocket)

    const values = Object.keys(sockets.socketNameMap).filter(
      s => s !== 'Trigger'
    )

    const socketDropdown = new DropdownControl({
      name: 'Socket Type',
      dataKey: 'socketType',
      values,
      ignored: ['trigger'],
      defaultValue: 'any Type',
    })

    socketDropdown.onData = (data: SocketNameType) => {
      this.addSocket.apply(this, [node, data])
    }

    node.inspector.add(socketDropdown)
    node.addInput(input).addOutput(output)

    if (node.data.socketType) {
      this.addSocket(node, node.data.socketType as SocketNameType)
    }

    return node
  }

  /**
   * Runs the worker functionality for the Cast component.
   * @param node - The WorkerData for the Cast component.
   * @param inputs - The worker inputs for the Cast component.
   * @returns - The output for the Cast component.
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const value = inputs.input[0]
    const targetType = node.data.socketType

    // Check the target type and perform the appropriate conversion
    switch (targetType) {
      case 'String':
        return { output: String(value) }
      case 'Number':
        return { output: Number(value) }
      case 'Boolean':
        return { output: Boolean(value) }
      case 'Object':
        return { output: Object(value) }
      default:
        return {
          output: value,
        }
    }
  }
}
