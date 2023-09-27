// DOCUMENTED
import Rete from 'shared/rete'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Random Gate takes a trigger input, and randomly fires one of the connected outputs.
 * @extends MagickComponent<void>
 */
export class RandomGate extends MagickComponent<void> {
  /**
   * Creates a new Random Gate component
   */
  constructor() {
    // Name of the component
    super(
      'Random Gate',
      {
        outputs: {},
      },
      'Flow',
      `Takes a trigger input and randomly fires one of the connected outputs.`
    )
  }

  /**
   * builds the node by assembling its inputs and controls
   * @param node - The MagickNode to build
   * @returns - Modified MagickNode
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const outputToggles = new SocketGeneratorControl({
      connectionType: 'output',
      taskType: 'option',
      socketType: 'triggerSocket',
      name: 'Toggle Sockets',
    })

    node.addInput(dataInput)

    node.inspector.add(outputToggles)

    return node
  }

  /**
   * Contains the main business logic of the node, passing results to the outputs.
   * @param node - The worker data object
   * @param _inputs - The worker inputs object
   * @param outputs - The worker outputs object
   */
  worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs
  ): void {
    // pick a random object from outputs objects
    const randomOutput =
      outputs[
        Object.keys(outputs)[
          Math.floor(Math.random() * Object.keys(outputs).length)
        ]
      ]
    const randomName = randomOutput.key as string
    // TODO: make sure you don't want node.outputs
    const nodeOutputs = node.data.outputs as Array<{ name: string }>

    // close all outputs
    if (node?._task) {
      if (node._task.closed.includes(randomName)) {
        // If the outputs closed has the incoming trigger, filter closed outputs to not include it
        node._task.closed = node._task.closed.filter(
          output => output !== randomName
        )
        console.log('if (node?._task) node._task.closed', node._task.closed)
      }

      node._task.closed = [...nodeOutputs.map(out => out.name)]
    }
  }
}
