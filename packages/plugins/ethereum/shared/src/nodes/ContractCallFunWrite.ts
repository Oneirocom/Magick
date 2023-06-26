// DOCUMENTED
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';
import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  stringSocket,
  numberSocket,
  arraySocket,
  triggerSocket,
  WorkerData,
} from '@magickml/core';

import * as ethers from 'ethers';
import { nativeNetworks } from '@magickml/plugin-ethereum-shared'

/** Call a write function from a contract */
const info = 'Call a write function from a contract';

type WorkerReturn = {
  output: string;
} | undefined;

/**
 * ContractCallFunWrite class for calling write function from a contract.
 */
export class ContractCallFunWrite extends MagickComponent<Promise<WorkerReturn>> {

  constructor() {
    super('PluginEthContractWrite', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

    this.contextMenuName = 'Contract Write';
    this.displayName = 'Contract Write';
  }

  /** Handles node destroy event */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id);
  }

  /** Sets up input/output connections for the node */
  builder(node: MagickNode) {

    node.data.socketKey = node?.data?.socketKey || uuidv4();

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const contractAddressInput = new Rete.Input(
      'contract_address',
      'Contract Address',
      stringSocket
    );
    const abiInput = new Rete.Input('contract_abi', 'ABI', stringSocket);
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket);
    const functionNameInput = new Rete.Input(
      'function_name',
      'Function Name',
      stringSocket
    );
    const functionArgsInput = new Rete.Input(
      'function_args',
      'Function Arguments',
      arraySocket
    );
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const urlOutput = new Rete.Output('output', 'Output', stringSocket);

    return node
      .addInput(dataInput)
      .addInput(chainIdInput)
      .addInput(contractAddressInput)
      .addInput(functionNameInput)
      .addInput(functionArgsInput)
      .addInput(abiInput)
      .addOutput(dataOutput)
      .addOutput(urlOutput);
  }

  /**
   * Worker function that handles calling contract-write function.
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: any,
  ): Promise<WorkerReturn> {

    const { secrets } = context.module
    if (!secrets.ethereum_private_key) {
      throw new Error('No Ethereum private key found in secrets');
    }

    const chainId = _inputs['chain_id'] && _inputs['chain_id'][0] as number

    const network = {
      name: nativeNetworks[chainId].name,
      chainId: nativeNetworks[chainId].chainId,
      _defaultProvider: (providers) => new providers.JsonRpcProvider(nativeNetworks[chainId].defaultRpcs.rpcHttp[0]),
    }

    const provider = ethers.getDefaultProvider(network);

    const contractAddress = _inputs['contract_address'] && _inputs['contract_address'][0] as string;
    const contractAbi = _inputs['contract_abi'] && _inputs['contract_abi'][0] as string;
    const functionName = _inputs['function_name'] && _inputs['function_name'][0] as string;
    const functionArguments = _inputs['function_args'] && _inputs['function_args'][0] as Array<string>;

    const wallet = new ethers.Wallet(secrets.ethereum_private_key, provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet)
    let result;
    if (functionArguments !== undefined) {
      result = await contract.functions[functionName](...functionArguments);
    } else {
      result = await contract.functions[functionName]();
    }

    return {
      output: result.hash,
    };
  }
}
