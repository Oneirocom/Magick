import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  DataSocketType,
} from '../../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `The random gate takes a trigger input, and randomly fires one of the connected outputs.`

export class RandomGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Random Gate')

    this.task = {
      outputs: {},
    }

    this.category = 'Logic'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const outputToggles = new SocketGeneratorControl({
      connectionType: 'output',
      taskType: 'option',
      socketType: 'triggerSocket',
      name: 'Toggle Sockets',
    })

    node.inspector.add(outputToggles)
    return node.addInput(dataInput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
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
    const nodeOutputs = node.data.outputs as DataSocketType[]

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
