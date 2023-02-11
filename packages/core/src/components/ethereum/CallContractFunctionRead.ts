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
} from '../../../types'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../magick-component'

const info = 'Call a arbitary function from a contract'

export class CallContractFunctionRead extends MagickComponent<void> {
  constructor() {
    super('Call Contract Read Function')

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
    const contractInput = new Rete.Input('tx', 'Contract', stringSocket)
    const functionInput = new Rete.Input('function', 'Function Name', stringSocket)
    const functionParamsInput = new Rete.Input('functionParams', 'Function Params', stringSocket)
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const resultOutput = new Rete.Output('output', 'Output', stringSocket)

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
    })

    node.inspector
      .add(rpcHttpControl)
      .add(inputGenerator)

    return node
      .addInput(contractInput)
      .addInput(functionInput)
      .addInput(functionParamsInput)
      .addInput(abiInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(resultOutput)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {

    const rpcHttp = node.data?.rpc_http as string

    const contractAddress = (inputs['tx'] && inputs['tx'][0]) as string
    const contractAbi = (inputs['abi'] && inputs['abi'][0]) as string

    const provider = new ethers.providers.JsonRpcProvider(rpcHttp)
    const contract = new ethers.Contract(contractAddress, contractAbi, provider)

    try {
      // TODO: call read with dynamic function name and params as client do with wagmi package
      await contract?.estimateGas.myString();
    } catch {
      console.error("estimateGas reverted");
      return
    }

    let res = undefined
    try {
      // TODO: call read with dynamic function name and params as client do with wagmi package
      res = await contract?.myString();
    } catch {
      console.error("call reverted");
      return
    }

    // TODO: need to be fixed, issue of loosing display() function from NodeData context
    // node.display(res)

    return {
      output: res,
    }
  }
}
