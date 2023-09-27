// DOCUMENTED
import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { numberSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `Takes two numbers as input and divides the first number by the second number.`

type WorkerOutputs = {
  result: number
}

/**
 * Divide two numbers.
 */
export class Divide extends MagickComponent<WorkerOutputs> {
  constructor() {
    super(
      'Divide',
      {
        outputs: { trigger: 'option', result: 'output' },
      },
      'Arithmetic/Arithmetic',
      info
    )
  }

  /**
   * Build the node for the Divide component
   * @param node - The MagickNode instance
   */
  builder(node: MagickNode): void {
    const firstNumSocket = new Rete.Input(
      'firstNumber',
      'First Number',
      numberSocket,
      false
    )

    const secondNumSocket = new Rete.Input(
      'secondNumber',
      'Second Number',
      numberSocket,
      false
    )

    const inspectorStartNumSocket = new InputControl({
      dataKey: 'firstNumber',
      name: 'First Number',
      defaultValue: 1,
      tooltip: 'Enter First Number',
    })

    const inspectorEndNumSocket = new InputControl({
      dataKey: 'secondNumber',
      name: 'Second Number',
      defaultValue: 1,
      tooltip: 'Enter Second Number',
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const result = new Rete.Output('result', 'Result', numberSocket)

    node
      .addInput(firstNumSocket)
      .addInput(secondNumSocket)
      .addInput(dataInput)
      .addOutput(result)

    node.inspector.add(inspectorStartNumSocket).add(inspectorEndNumSocket)
  }

  /**
   * Worker function to execute the Divide functionality
   * @param node - The WorkerData instance
   * @param inputs - The MagickWorkerInputs instance
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const firstNumber =
      (inputs['firstNumber'] && (inputs['firstNumber'][0] as number)) ??
      (node.data.firstNumber as number)
    const secondNumber =
      (inputs['secondNumber'] && (inputs['secondNumber'][0] as number)) ??
      (node.data.secondNumber as number)

    const result = (firstNumber / secondNumber) as number

    return {
      result,
    }
  }
}
