// DOCUMENTED
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';
import * as ethers from 'ethers';
import { nativeNetworks } from '../';

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  stringSocket,
  numberSocket,
  triggerSocket,
  WorkerData,
} from '@magickml/core';

const info = `Deploys a contract from Solidity code, a standard for defining non-fungible tokens on EVM machines.`;

type WorkerReturn = {
  output: string;
  tx: string;
  contract: string;
} | undefined;

/**
 * ContractDeploy class
 */
export class ContractDeploy extends MagickComponent<Promise<WorkerReturn>> {

  // Constructor
  constructor() {
    super('PluginEthContractDeploy', {
      outputs: {
        trigger: 'option',
        balance_before: 'output',
        balance: 'output',
        tx: 'output',
        contract: 'output',
      },
    }, 'Ethereum', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

    this.contextMenuName = 'Contract Deploy';
    this.displayName = 'Contract Deploy';
  }

  /**
   * Builder function for nodes
   * @param node
   */
  builder(node: MagickNode) {
    // Initialize socketKey
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    // Create inputs
    const bytecodeInput = new Rete.Input('bytecode', 'Bytecode', stringSocket);
    const abiInput = new Rete.Input('abi', 'ABI', stringSocket);
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);

    // Create outputs
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const txOutput = new Rete.Output('tx', 'Transaction', stringSocket);
    const contractAddrOutput = new Rete.Output('contract', 'Contract Address', stringSocket);

    // Add inputs and outputs to the node
    return node
      .addInput(dataInput)
      .addInput(bytecodeInput)
      .addInput(abiInput)
      .addInput(chainIdInput)
      .addOutput(dataOutput)
      .addOutput(contractAddrOutput)
      .addOutput(txOutput);
  }

  /**
   * Worker function
   * @param node
   * @param _inputs
   * @param _outputs
   * @param {string | undefined} data
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: any,
  ): Promise<WorkerReturn> {
    // Close trigger
    this._task.closed = ['trigger'];

    const { secrets } = context.module
    if (!secrets.ethereum_private_key) {
      throw new Error('No Ethereum private key found in secrets');
    }

    // Get chainId
    const chainId = _inputs['chain_id'] && _inputs['chain_id'][0] as number

    // Specify network
    const network = {
      name: nativeNetworks[chainId].name,
      chainId: nativeNetworks[chainId].chainId,
      _defaultProvider: (providers) => new providers.JsonRpcProvider(nativeNetworks[chainId].defaultRpcs.rpcHttp[0]),
    }

    // Provide network
    let provider = ethers.getDefaultProvider(network);
    if (node.data?.rpc_http) {
      provider = new ethers.providers.JsonRpcProvider(node.data?.rpc_http as string, chainId);
    }

    // Get socket input data
    const contractAbi = _inputs['abi'] && _inputs['abi'][0] as string;
    const contractByteCode = _inputs['bytecode'] && _inputs['bytecode'][0] as string;

    // Create wallet and contract factory
    const wallet = new ethers.Wallet(secrets.ethereum_private_key, provider);
    const factory = new ethers.ContractFactory(contractAbi, contractByteCode, wallet);
    const transactionDeploy = factory.getDeployTransaction();
    const feeData = await wallet.getFeeData();

    const tx = await wallet.sendTransaction({
      data: transactionDeploy.data,
      gasPrice: feeData.gasPrice ?? undefined,
      gasLimit: 20000000,
    });
    const contractAddress = await tx.wait();

    this._task.closed = [];

    // Return data, transaction, and contract address
    return {
      output: tx.hash,
      tx: tx.hash,
      contract: contractAddress.contractAddress,
    };
  }
}
