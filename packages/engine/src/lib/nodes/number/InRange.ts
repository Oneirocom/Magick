import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { numberSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `The In Range component takes either a manually input set of numbers or a dynamically generated set of numbers as a boundary. When supplied with a value to test its existance between the set range, will trigger 1 of 2 outputs. If the number exists within the range including the start and end number, will trigger the true output else will trigger the false output.`

export class InRange extends MagickComponent<void> {
  constructor() {
    super('In Range', {
      outputs: { true: 'option', false: 'option' },
    }, 'Number', info)
  }

  builder(node: MagickNode) {
    const startNumSocket = new Rete.Input(
      'startNumber',
      'Start Number',
      numberSocket,
      false
    )

    const endNumSocket = new Rete.Input(
      'endNumber',
      'End Number',
      numberSocket,
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
    const testInput = new Rete.Input('input', 'Input To Test', numberSocket)

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

  worker(node: WorkerData, inputs: MagickWorkerInputs) {
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
