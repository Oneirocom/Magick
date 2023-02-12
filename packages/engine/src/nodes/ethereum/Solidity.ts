import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { CodeControl } from '../../dataControls/CodeControl'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { InputControl } from '../../dataControls/InputControl'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { triggerSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const defaultCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract SimpleContract {

    uint public myValue = 50;
    string public myString = "Hello World!";

    function setValue(uint _myValue) public {
        myValue = _myValue;
    }

    function setString(string memory _myString) public {
        myString = _myString;
    }

}
`

const info = `This is Solidity block of code, when trigger the code will be compiled and returned as bytecode`

export class Solidity extends MagickComponent<void> {

  constructor() {
    // Name of the component
    super('Solidity')

    this.task = {
      outputs: {
        output: 'output',
        bytecode: 'output',
        abi: 'output',
        trigger: 'option',
      },
    }
    this.category = 'Ethereum'
    this.info = info
    this.display = true
    this.runFromCache = true
  }

  builder(node: MagickNode) {
    if (!node.data.code) node.data.code = defaultCode

    const optimizationControl = new BooleanControl({
      dataKey: 'optimization',
      name: 'Optimization',
    })

    const optimizationNumControl = new NumberControl({
      dataKey: 'optimization_num',
      name: 'Oprimization Number',
    })

    const codeControl = new CodeControl({
      dataKey: 'code',
      name: 'Code',
      language: 'solidity'
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    node.inspector
      .add(optimizationControl)
      .add(optimizationNumControl)
      .add(nameControl)
      .add(codeControl)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const bytecodeOutput = new Rete.Output('bytecode', 'Bytecode', anySocket)
    const abiOutput = new Rete.Output('abi', 'ABI', anySocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(bytecodeOutput)
      .addOutput(abiOutput)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { magick: EngineContext; data: { code: unknown } }
  ) {
    const { magick, data } = context
    const { processCode, getCurrentGameState } = magick
    if (!processCode) return

    const state = getCurrentGameState()

    try {
      const optimization = node.data?.optimization ? node.data?.optimization : false
      let optimization_num = 100

      if (node.data?.optimization_num) {
        const parsed = parseInt(node.data?.optimization_num as string);
        if (!isNaN(parsed)) {
          optimization_num = parsed
        }
      }

      const { bytecode, abi } = await processCode(node.data.code, inputs, {data, ...{optimization, optimization_num}}, state, 'solidity')

      // TODO: need to be fixed, issue of loosing display() function from NodeData context
      // node.display({
      //   bytecode: bytecode,
      //   abi
      // })

      return {
        bytecode: bytecode,
        abi: abi
      }
    } catch (err) {
      throw err
    }
  }
}
