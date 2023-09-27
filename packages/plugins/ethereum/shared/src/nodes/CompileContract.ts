// DOCUMENTED
import { isEmpty } from 'lodash'
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'
import { API_ROOT_URL } from 'shared/config'

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
} from '@magickml/core'

// Default solidity code
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

type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * CompileContract class is responsible for compiling the solidity contract and returning bytecode & ABI
 */
export class CompileContract extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    // Name of the component
    super(
      'PluginEthCompileContract',
      {
        outputs: {
          output: 'output',
          bytecode: 'output',
          abi: 'output',
          trigger: 'option',
        },
      },
      'Ethereum',
      info
    )

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

    this.contextMenuName = 'Compile Contract'
    this.displayName = 'Compile Contract'
  }

  /**
   * Sets up the node with input controls and sockets
   *
   * @param node - The MagickNode being built
   * @returns - The node with inputs and outputs
   */
  builder(node: MagickNode) {
    if (!node.data.code) node.data.code = defaultCode

    // Inspector controls
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
      language: 'solidity',
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    // Add inspector controls
    node.inspector
      .add(optimizationControl)
      .add(optimizationNumControl)
      .add(nameControl)
      .add(codeControl)

    // Node input/output sockets
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const bytecodeOutput = new Rete.Output('bytecode', 'Bytecode', anySocket)
    const abiOutput = new Rete.Output('abi', 'ABI', anySocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(bytecodeOutput)
      .addOutput(abiOutput)
  }

  /**
   * Worker function to compile the solidity contract
   *
   * @param node - WorkerData object with data for the node
   * @param _inputs - Inputs to the worker
   * @param outputs - Outputs to the worker
   * @param data - Optional data to be returned in the output
   * @returns - Resulting outputs including bytecode and ABI
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    if (node?._task) node._task.closed = ['trigger']

    const server = `${API_ROOT_URL}/solidity`

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        code: node.data.code,
      },
    }

    const response = await fetch(server, requestOptions as any).catch(error =>
      console.log('error', error)
    )

    const result = await (response as Response).json()

    const contract = result.output.contracts['code.sol']['SimpleContract']

    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []

      return {
        output: data,
        bytecode: contract.evm.bytecode.object,
        abi: contract.abi,
      }
    }
  }
}
