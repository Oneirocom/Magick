import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  BooleanControl,
  NumberControl,
  CodeControl,
  triggerSocket,
} from '@magickml/engine'

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

const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

export class Solidity extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

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

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
      hide: true,
    }

    this.category = 'Ethereum'
    this.info = info
    this.display = true
    this.contextMenuName = 'Solidity'
    this.displayName = 'Solidity'
  }


  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
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

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(bytecodeOutput)
      .addOutput(abiOutput)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    this._task.closed = ['trigger']
    console.log('********* processing input to ethereum input *********')
    console.log(data)

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      if (!silent) node.display(data)
      return {
        output: data,
      }
    }
  }
}
