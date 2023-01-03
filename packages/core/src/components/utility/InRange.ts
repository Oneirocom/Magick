import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, numSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `The In Range component takes either a manually input set of numbers or a dynamically generated set of numbers as a boundary. When supplied with a value to test its existance between the set range, will trigger 1 of 2 outputs. If the number exists within the range including the start and end number, will trigger the true output else will trigger the false output.`

export class InRange extends ThothComponent<void> {
  constructor() {
    super('In Range')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }
    this.category = 'Logic'
    this.info = info
  }

  builder(node: ThothNode) {
    const startNumSocket = new Rete.Input(
      'startNumber',
      'Start Number',
      numSocket,
      false
    )

    const endNumSocket = new Rete.Input(
      'endNumber',
      'End Number',
      numSocket,
      false
    )
    const inspectorStartNumSocket = new InputControl({
      dataKey: 'startNumber',
      name: 'Start Number',
      defaultValue: 10,
    })
    const inspectorEndNumSocket = new InputControl({
      dataKey: 'endNumber',
      name: 'End Number',
      defaultValue: 100,
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const testInput = new Rete.Input('input', 'Input To Test', numSocket)

    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    node
      .addInput(testInput)
      .addInput(startNumSocket)
      .addInput(endNumSocket)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)

    node.inspector.add(inspectorStartNumSocket).add(inspectorEndNumSocket)
  }

  worker(node: NodeData, inputs: ThothWorkerInputs) {
    const startRange =
      (inputs['startNumber'][0] as number) ?? (node.data.startNumber as number)
    const endRange =
      (inputs['endNumber'][0] as number) ?? (node.data.endNumber as number)
    const numberToTest = inputs['input'][0] as number

    if (numberToTest >= startRange && numberToTest <= endRange) {
      this._task.closed = ['false']
    } else {
      this._task.closed = ['true']
    }
  }
}
