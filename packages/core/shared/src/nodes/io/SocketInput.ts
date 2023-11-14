// DOCUMENTED
import Rete from '@magickml/rete'
import { v4 as uuidv4 } from 'uuid'

import { MagickComponent } from '../../engine'
import { anySocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { FewshotControl } from '../../dataControls/FewshotControl'

/** Component info text */
const info = `The socket input allows you to pass more values into a subspell alongside the main subspell event.  For testing your spell you can set a default value to the input.`

/**
 * Output component
 */
export class SocketInput extends MagickComponent<void> {
  /**
   * Constructor for Output component
   */
  constructor() {
    super(
      'Socket Input',
      {
        outputs: {
          output: 'output',
        },
      },
      'IO',
      info
    )

    // this.common = true
    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }
  }

  /**
   * Builder for Output component
   * @param node - MagickNode instance
   * @returns MagickNode instance with configured inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    const output = new Rete.Output('output', 'Output', anySocket)

    node.data.name = node.data.name || `input-${node.id}`

    // Set isInput to true so we can identify this node as an input node
    // node.data.isInput = true

    // Each node should have a unique socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
      defaultValue: node.data.name,
    })

    const fewshotControl = new FewshotControl({ tooltip: 'Open fewshot' })

    node.inspector.add(nameInput).add(fewshotControl)

    return node.addOutput(output)
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
    node: WorkerData,
    // @eslint-ignore-next-line
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    // @eslint-ignore-next-line
    context: ModuleContext
  ): Promise<{ output: string }> {
    if (outputs.output) {
      return outputs as unknown as { output: string }
    }

    return {
      output: node.data.fewshot as string,
    }
  }
}
