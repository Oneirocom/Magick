import Rete from 'rete'

import {
  MagickNodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  DataSocketType,
  WorkerData,
  AsDataSocket,
} from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `The random gate takes a trigger input, and randomly fires one of the connected outputs.`

export class RandomGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Random Gate', {
      outputs: {},
    }, 'Flow', info)
  }

  // the builder is used to "assemble" the node component.

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const outputToggles = new SocketGeneratorControl({
      connectionType: 'output',
      taskType: 'option',
      socketType: 'triggerSocket',
      name: 'Toggle Sockets',
    })

    node
      .addInput(dataInput)

    node.inspector.add(outputToggles)
    
    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs
  ) {
    // pick a random object from outputs objects
    const randomOutput =
      outputs[
        Object.keys(outputs)[
          Math.floor(Math.random() * Object.keys(outputs).length)
        ]
      ]
    const randomName = randomOutput.key as string
    // TODO: make sure you don't want node.outputs
    const nodeOutputs = node.data.outputs as Array<{name:string}>

    // close all outputs
    this._task.closed = [...nodeOutputs.map(out => out.name)]
    if (this._task.closed.includes(randomName)) {
      // If the ouputs closed has the incoming trigger, filter closed outputs to not include it
      this._task.closed = this._task.closed.filter(
        output => output !== randomName
      )
      console.log('this._task.closed', this._task.closed)
    }
  }
}
