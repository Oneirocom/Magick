// DOCUMENTED
/**
 * @fileoverview The Destructure component allows you to destructure properties out of an object.
 */

import Rete from 'shared/rete'
import { MagickComponent } from '../../engine'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { objectSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'

/**
 * Instantiates a new Instance of the Destructure component.
 * This component is used to destructure properties out of an object.
 */

export class GetValuesFromObject extends MagickComponent<void> {
  constructor() {
    super(
      'Get Values From Object',
      {
        outputs: {
          trigger: 'option',
        },
      } as TaskOptions,
      'Data/Object',
      'Takes an object input and outputs any number of named properties that are found in the object.'
    )
  }

  /**
   * The builder is used to create the node component structure.
   * @param node The node to be assembled
   * @returns The assembled node.
   */

  builder(node: MagickNode): MagickNode {
    // Create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const objectInput = new Rete.Input('object', 'Object', objectSocket)
    const outputTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const socketGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      name: 'Property Name',
      ignored: ['trigger'],
      tooltip: 'Add property name',
    })

    node.addInput(dataInput).addInput(objectInput).addOutput(outputTrigger)

    node.inspector.add(socketGenerator)

    return node
  }

  /**
   * The worker contains the main business logic of the node.
   * It will pass those results to the outputs to be consumed by any connected components
   * @param node The node.
   * @param inputs The required inputs for executing the node.
   */

  worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const object =
      inputs.object && (inputs.object[0] as Record<string, unknown>)

    const output = Object.keys(node.outputs).reduce((acc, key) => {
      acc[key] = object[key]
      return acc
    }, {} as Record<string, unknown>)

    return output
  }
}
