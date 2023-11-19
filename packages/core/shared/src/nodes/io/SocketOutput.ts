// DOCUMENTED
import Rete from '@magickml/rete'
import { v4 as uuidv4 } from 'uuid'

import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'

/** Component info text */
const info = `The socket output is an interim socket used to pass values out from your spell when acting as a subspell. Note that each output requires a unique name to be used as a socket.`

/**
 * Output component
 */
export class SocketOutput extends MagickComponent<void> {
  /**
   * Constructor for Output component
   */
  constructor() {
    super(
      'Socket Output',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'IO',
      info
    )

    this.common = true
    this.module = {
      nodeType: 'output',
      socket: anySocket,
    }
  }

  /**
   * Builder for Output component
   * @param node - MagickNode instance
   * @returns MagickNode instance with configured inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)
    // const output = new Rete.Output('output', 'Output', anySocket)

    node.data.sendToPlaytest = true
    node.data.name = node.data.name || `output-${node.id}`

    node.data.isOutput = true

    // need to automate this part! Won't work without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Output name',
      defaultValue: node.data.name,
    })

    node.inspector.add(nameInput)

    return node.addInput(triggerInput).addInput(textInput)
  }

  /**
   * Worker function for Output component
   * @param node - WorkerData object
   * @param inputs - MagicWorkerInputs object
   * @param _outputs - MagicWorkerOutputs object
   * @param context - Module and EditorContext instances
   * @returns output data
   */
  async worker(
    // @eslint-ignore-next-line
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    // @eslint-ignore-next-line
    context: ModuleContext
  ): Promise<{ output: string }> {
    if (!inputs.input) throw new Error('No input provided to output component')
    console.log({ inputs })

    const output = inputs.input[0] as string

    return {
      output,
    }
  }
}
