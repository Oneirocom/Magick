// DOCUMENTED
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';
import {
  anySocket,
  MagickComponent,
  MagickNode,
  numberSocket,
  stringSocket,
  triggerSocket,
  arraySocket,
  WorkerData,
  MagickWorkerInputs,
} from '@magickml/core';
import * as ethers from 'ethers';
import { nativeNetworks } from '@magickml/plugin-ethereum-shared'

const info = 'Call an arbitrary function from a EVM contract';

type WorkerReturn = {
  output: string | null;
} | undefined;

/**
 * Represents a contract call component for reading
 * an Ethereum contract's function call result.
 */
export class ContractCallFunRead extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('PluginEthContractRead', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

    this.contextMenuName = 'Contract Read';
    this.displayName = 'Contract Read';
  }

  /**
   * Called upon the destruction of the MagickNode.
   * @param {MagickNode} node - The MagickNode to be destroyed
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id);
  }

  /**
   * Builds the node inputs and outputs.
   * @param {MagickNode} node - The MagickNode being built
   * @returns {MagickNode} - The built and configured MagickNode
   */
  builder(node: MagickNode): MagickNode {
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    const contractAddressInput = new Rete.Input('contract_address', 'Contract Address', stringSocket);
    const functionNameInput = new Rete.Input('function_name', 'Function Name', stringSocket);
    const functionArgsInput = new Rete.Input('function_args', 'Function Arguments', arraySocket);
    const abiInput = new Rete.Input('contract_abi', 'ABI', stringSocket);
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const resultOutput = new Rete.Output('output', 'Output', stringSocket);

    return node
      .addInput(dataInput)
      .addInput(chainIdInput)
      .addInput(contractAddressInput)
      .addInput(functionNameInput)
      .addInput(functionArgsInput)
      .addInput(abiInput)
      .addOutput(dataOutput)
      .addOutput(resultOutput);
  }

  /**
   * Worker function for fetching the contract call result.
   * @param {WorkerData} node - The worker node data
   * @param {MagickWorkerInputs} _inputs - The input data for the worker
   * @returns {Promise<WorkerReturn>} - The resolved contract call result
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs
  ): Promise<WorkerReturn> {

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

    const contract = new ethers.Contract(contractAddress, contractAbi, provider)

    let result;
    if (functionArguments !== undefined) {
      result = await contract.functions[functionName](...functionArguments);
    } else {
      result = await contract.functions[functionName]();
    }

    return {
      output: result,
    }
  }
}
