// DOCUMENTED
import { isEmpty } from 'lodash';
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';
import * as ethers from 'ethers';
import { nativeNetworks } from '@magickml/plugin-ethereum-shared';

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  numberSocket,
  stringSocket,
  triggerSocket,
  WorkerData,
} from '@magickml/core';

/** Component information */
const info = `Check the balance of an Ethereum wallet for an ERC20 at a contract address`;

/** Worker return type */
type WorkerReturn = {
  output: string;
} | undefined;

/**
 * GetERC20TokenBalance class
 * @extends MagickComponent
 */
export class GetERC20TokenBalance extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor
   */
  constructor() {
    super('PluginEthGetERC20TokenBalance', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

    this.contextMenuName = 'Get ERC20 Balance';
    this.displayName = 'Get ERC20 Token Balance';
  }

  /**
   * Destroyed
   * @param {MagickNode} node - The node to be destroyed.
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id);
  }

  /**
   * Builder
   * @param {MagickNode} node - The node to build.
   * @returns {Rete.Node} - The built node.
   */
  builder(node: MagickNode) {
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    const addressInput = new Rete.Input('account_address', 'Account Address', stringSocket);
    const contractAddressInput = new Rete.Input(
      'token_address',
      'Token Address',
      stringSocket
    );
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket);

    return node
      .addInput(dataInput)
      .addInput(chainIdInput)
      .addInput(addressInput)
      .addInput(contractAddressInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput);
  }

  /**
   * Worker
   * @async
   * @param {WorkerData} node - The node to work on.
   * @param {MagickWorkerInputs} _inputs - The worker inputs.
   * @param {MagickWorkerOutputs} outputs - The worker outputs.
   * @param {{ data: string | undefined }} arg - The data argument.
   * @returns {Promise<WorkerReturn>} - The worker return data.
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ): Promise<WorkerReturn> {
    this._task.closed = ['trigger'];

    const chainId = _inputs['chain_id'] && _inputs['chain_id'][0] as number;
    const accountAddress = _inputs['account_address'] && _inputs['account_address'][0] as string;
    const tokenAddress = _inputs['token_address'] && _inputs['token_address'][0] as string;
    const tokenAbi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
    ];

    const network = {
      name: nativeNetworks[chainId].name,
      chainId: nativeNetworks[chainId].chainId,
      _defaultProvider: (providers) => new providers.JsonRpcProvider(nativeNetworks[chainId].defaultRpcs.rpcHttp[0]),
    };
    const provider = ethers.getDefaultProvider(network);
    const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);

    const decimals = await contract.functions['decimals']();
    const balance = await contract.functions['balanceOf'](accountAddress);
    const balanceFormatted = ethers.utils.formatUnits(balance[0], decimals[0]);

    if (data && !isEmpty(data)) {
      this._task.closed = [];

      return {
        output: balanceFormatted,
      };
    }
  }
}
