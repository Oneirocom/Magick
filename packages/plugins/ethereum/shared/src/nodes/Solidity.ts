// DOCUMENTED
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';
import { API_ROOT_URL, DEFAULT_USER_TOKEN } from '@magickml/config';

import {
  stringSocket,
  InputControl,
  BooleanControl,
  NumberControl,
  MagickComponent,
  MagickNode,
  CodeControl,
  triggerSocket,
  WorkerData,
} from '@magickml/core';

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
`;

const info = `This is Solidity block of code, when trigger the code will be compiled and returned as bytecode/abi`;

type WorkerReturn = {
  bytecode: any
  abi: any
}

/**
 * A Solidity component for the Ethereum plugin that compiles Solidity code via API.
 */
export class Solidity extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('PluginEthSolidity', {
      outputs: {
        bytecode: 'output',
        abi: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info);

    this.contextMenuName = 'Solidity';
    this.displayName = 'Solidity';
  }

  /**
   * Builds the Solidity component with input controls, data inputs/outputs.
   * @param node - The MagickNode object.
   * @returns - The updated MagickNode object.
   */
  builder(node: MagickNode): MagickNode {
    if (!node.data.code) node.data.code = defaultCode;

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    });
    const codeControl = new CodeControl({
      dataKey: 'code',
      name: 'Code',
      language: 'sol',
    });
    const optimizationEnableControl = new BooleanControl({
      dataKey: 'optimization_enable',
      name: 'Optimization',
      defaultValue: false,
    });
    const optimizationNumberControl = new NumberControl({
      dataKey: 'optimization_number',
      name: 'Oprimization Number',
      defaultValue: 200,
      tooltip: 'Input for number of optimizations'
    });

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const bytecodeOutput = new Rete.Output('bytecode', 'Bytecode', stringSocket);
    const abiOutput = new Rete.Output('abi', 'ABI', stringSocket);

    node.data.socketKey = node?.data?.socketKey || uuidv4();

    node.inspector
      .add(nameControl)
      .add(codeControl)
      .add(optimizationEnableControl)
      .add(optimizationNumberControl);

    node.addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(bytecodeOutput)
      .addOutput(abiOutput);

    return node;
  }

  /**
   * Sends the code to the API server for compilation and returns the bytecode and abi.
   * @param node - The WorkerData object.
   * @returns - An object with properties "bytecode" and "abi".
   */
  async worker(node: WorkerData): Promise<WorkerReturn> {
    // TODO: Pass the missing optimizer data
    // const optimizationEnable = (node.data as { optimization_enable: boolean }).optimization_enable;
    // const optimizationNumber = (node.data as { optimization_number: number }).optimization_number;

    const requestUrl = `${API_ROOT_URL}/solidity`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_USER_TOKEN}`,
      },
      body: JSON.stringify({
        code: node.data.code,
        optimizer: true,
        optimizerRuns: 200,
      }),
    };

    const response = await fetch(requestUrl, requestOptions);
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const res = await response.json();

    const contract = res.result.contracts['code.sol']['SimpleContract'];

    return {
      bytecode: contract.evm.bytecode.object,
      abi: contract.abi,
    };
  }
}
