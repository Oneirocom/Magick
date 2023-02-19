/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
} from '../../types'
import { triggerSocket, numSocket, stringSocket, anySocket } from '../../sockets'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../magick-component'

const info = 'Call a write function from a contract'

export class CallContractFunctionWrite extends MagickComponent<void> {
  constructor() {
    super('Call Contract Write Function')

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
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const contractAddressInput = new Rete.Input('contract_addr', 'Contract Address', stringSocket)
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numSocket)
    const functionNameInput = new Rete.Input('function_name', 'Function Name', stringSocket)
    const functionArgsInput = new Rete.Input('function_args', 'Function Arguments', stringSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const urlOutput = new Rete.Output('output', 'Output', stringSocket)

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
      write: true
    })

    node.inspector
      .add(chainIdControl)

    return node
      .addInput(abiInput)
      .addInput(chainIdInput)
      .addInput(functionNameInput)
      .addInput(functionArgsInput)
      .addInput(contractAddressInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(urlOutput)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs,outputs, { silent }: { silent: boolean }    ) {

    let chainId = 80001
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

    const contractAddress = (inputs['contract_addr'] && inputs['contract_addr'][0]) as string
    const functionName = (inputs['function_name'] && inputs['function_name'][0]) as string

    if(!silent) {
      node.display(contractAddress)
    }

    return {
      output: `http://localhost:4200/contract/${chainId}/${contractAddress}/${functionName}`,
    }
  }
}
