import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'
import { API_ROOT_URL } from '@magickml/engine'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  BooleanControl,
  NumberControl,
  CodeControl,
  triggerSocket,
  WorkerData,
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

const info = `This is Solidity block of code, when trigger the code will be compiled and returned as bytecode`

type InputReturn = {
  output: string
} | undefined

export class CompileContract extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    // Name of the component
    super('PluginEthCompileContract', {
      outputs: {
        output: 'output',
        bytecode: 'output',
        abi: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info)

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

    this.display = true
    this.contextMenuName = 'Compile Contract'
    this.displayName = 'Compile Contract'
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

  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    this._task.closed = ['trigger']

    const server = `${API_ROOT_URL}/solidity`

    const form = new FormData();
    form.append("code", defaultCode);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        code: node.data.code,
      },
    }

    const r = await fetch(server, requestOptions as any).catch(error =>
      console.log('error', error)
    )

    const result = await (r as Response).json()

    const contract = result.output.contracts['code.sol']['SimpleContract']

    if (data && !isEmpty(data)) {
      this._task.closed = []

      return {
        output: data,
        bytecode: contract.evm.bytecode.object,
        abi: contract.abi,
      }
    }
  }
}
