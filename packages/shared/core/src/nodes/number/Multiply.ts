// DOCUMENTED
import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { numberSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `Takes two numbers as input and multiplies them together.`

type WorkerOutputs = {
  result: number
}

/**
 * Multiply two numbers together.
 */
export class Multiply extends MagickComponent<WorkerOutputs> {
  constructor() {
    super(
      'Multiply',
      {
        outputs: { trigger: 'option', result: 'output' },
      },
      'Arithmetic/Arithmetic',
      info
    )
  }

  /**
   * Build the node for the InRange component
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
      tooltip: 'Enter the first number',
    })

    const inspectorEndNumSocket = new InputControl({
      dataKey: 'secondNumber',
      name: 'Second Number',
      defaultValue: 1,
      tooltip: 'Enter the second number',
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const result = new Rete.Output('result', 'Result', numberSocket)

    node
      .addInput(firstNumSocket)
      .addInput(secondNumSocket)
      .addInput(dataInput)
      .addOutput(result)
      .addOutput(dataOutput)

    node.inspector.add(inspectorStartNumSocket).add(inspectorEndNumSocket)
  }

  /**
   * Worker function to execute the InRange functionality
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

    const result = (firstNumber * secondNumber) as number

    return {
      result,
    }
  }
}
