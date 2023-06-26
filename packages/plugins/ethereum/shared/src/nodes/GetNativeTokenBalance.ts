// DOCUMENTED
import { isEmpty } from 'lodash';
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

// Information about the functionality
const info = 'Check the balance of an Ethereum wallet';

// Type definition for worker return
type WorkerReturn = {
  output: string;
} | undefined;

/**
 * GetNativeTokenBalance class that extends MagickComponent.
 */
export class GetNativeTokenBalance extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('PluginEthGetNativeTokenBalance', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Ethereum', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

    this.contextMenuName = 'Get Native Balance';
    this.displayName = 'Get Native Token Balance';
  }

  /**
   * Handles node deletion.
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id);
  }

  /**
   * Sets up the node with appropriate inputs and outputs.
   */
  builder(node: MagickNode) {
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    const accountAddressInput = new Rete.Input('account_address', 'Account Address', stringSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket);
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket);

    return node
      .addInput(dataInput)
      .addInput(accountAddressInput)
      .addInput(chainIdInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput);
  }

  /**
   * Worker function that retrieves and formats the Ethereum wallet balance.
   */
  async worker(
    _node: WorkerData,
    _inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ): Promise<WorkerReturn> {
    // Placeholder for future task
    this._task.closed = ['trigger'];

    const chainId = _inputs['chain_id'] && _inputs['chain_id'][0] as number;
    const accountAddress = _inputs['account_address'] && _inputs['account_address'][0] as string;

    const network = {
      name: nativeNetworks[chainId].name,
      chainId: nativeNetworks[chainId].chainId,
      _defaultProvider: (providers) => new providers.JsonRpcProvider(nativeNetworks[chainId].defaultRpcs.rpcHttp[0]),
    };
    const provider = ethers.getDefaultProvider(network);

    const balance = await provider.getBalance(accountAddress);
    const balanceFormatted = ethers.utils.formatEther(balance);

    if (data && !isEmpty(data)) {
      // Prepare for future task
      this._task.closed = [];

      return {
        output: balanceFormatted,
      };
    }
  }
}
