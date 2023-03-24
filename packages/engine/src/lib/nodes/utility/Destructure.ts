import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { objectSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'
import { SocketGeneratorControl } from './../../dataControls/SocketGenerator'

const info = `Destructure properties out of an object`

export class Destructure extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Destructure', {
      outputs: {
        trigger: 'option',
      },
    } as TaskOptions, 'Utility', info)
  }
  // the builder is used to "assemble" the node component.

  builder(node: MagickNode): MagickNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const objectInput = new Rete.Input('object', 'Object', objectSocket)
    const outputTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const socketGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      name: 'Property Name',
      ignored: ['trigger'],
    })

    node
      .addInput(dataInput)
      .addInput(objectInput)
      .addOutput(outputTrigger)

    node.inspector.add(socketGenerator)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const object = inputs.object[0] as Record<string, unknown>

    const output = Object.keys(node.outputs).reduce((acc, key) => {
      acc[key] = object[key]
      return acc
    }, {} as Record<string, unknown>)

    console.log('Destructured output', output)

    return output
  }
}
