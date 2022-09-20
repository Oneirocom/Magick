import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { objectSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `Destructure properties out of an object`

export class Destructure extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Destructure')

    this.task = {
      outputs: {
        trigger: 'option',
      },
      init: () => {},
      onRun: () => {},
    } as TaskOptions
    this.category = 'Utility'
    this.info = info
  }
  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode): ThothNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const objectInput = new Rete.Input('object', 'Object', objectSocket)
    const outputTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const socketGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      name: 'Property Name',
    })

    node.inspector.add(socketGenerator)
    return node
      .addInput(dataInput)
      .addInput(objectInput)
      .addOutput(outputTrigger)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData, inputs: ThothWorkerInputs) {
    // @ts-ignore
    const object = inputs.object[0] as Record<string, any>

    const output = Object.keys(node.outputs).reduce((acc, key) => {
      acc[key] = object[key]
      return acc
    }, {} as Record<any, any>)

    console.log('Destructured output', output)

    return output
  }
}
