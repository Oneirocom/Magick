/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ethers from 'ethers'
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { triggerSocket, numSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Check the balance of an ethereum wallet'

export class CheckEthBalance extends MagickComponent<void> {
  constructor() {
    super('Check Balance')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Ethereum'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const addressInput = new Rete.Input('address', 'Address', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const rpcHttpInput = new Rete.Input('rpc_http', 'RPC HTTP Endpoint', stringSocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    const chainIdControl = new DropdownControl({
      name: 'Chain',
      dataKey: 'chain_id',
      values: [
        '1',
        '11155111',
        '5',
        '137',
        '80001'
      ],
      defaultValue: '80001',
    })

    node.inspector
      .add(rpcHttpControl)
      .add(chainIdControl)

    return node
      .addInput(addressInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {
    const defaultNetwork = {
      name: 'maticmaticmum',
      chainId: 80001,
      _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai')
    };

    let chainId = defaultNetwork.chainId
    if (node.data?.chain_id) {
      const parsed = parseInt(node.data?.chain_id as string);
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }
    if (inputs['chain_id']) {
      const parsed = parseInt(inputs['chain_id'][0] as string);
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }

    let provider = ethers.getDefaultProvider(defaultNetwork)
    if (node.data?.rpc_http) {
      provider = new ethers.providers.JsonRpcProvider(node.data?.rpc_http as string, chainId)
    }
    if (inputs['rpc_http']) {
      provider = new ethers.providers.JsonRpcProvider(inputs['rpc_http'][0] as string, chainId)
    }

    const address = inputs['address'][0] as unknown as string
    const balance = await provider.getBalance(address)
    const resultInEth = ethers.utils.formatEther(balance).toString()

    // TODO: need to be fixed, issue of loosing display() function from NodeData context
    // node.display(resultInEth)

    return {
      output: resultInEth,
    }
  }
}
