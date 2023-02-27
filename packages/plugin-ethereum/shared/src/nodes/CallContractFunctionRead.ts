import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'
import * as ethers from 'ethers'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  stringSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Call a arbitary function from a contract`

type InputReturn = {
  output: unknown
}

export class CallContractFunctionRead extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
    super('Contract Read')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
      hide: true,
    }

    this.category = 'Ethereum'
    this.info = info
    this.display = true
    this.contextMenuName = 'Contract Read'
    this.displayName = 'Contract Read'
  }

  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const contractInput = new Rete.Input('tx', 'Contract', stringSocket)
    const functionInput = new Rete.Input(
      'function',
      'Function Name',
      stringSocket
    )
    const functionParamsInput = new Rete.Input(
      'functionParams',
      'Function Params',
      stringSocket
    )
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const resultOutput = new Rete.Output('output', 'Output', stringSocket)

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    node.inspector.add(rpcHttpControl)

    return node
      .addInput(dataInput)
      .addInput(contractInput)
      .addInput(functionInput)
      .addInput(functionParamsInput)
      .addInput(abiInput)
      .addOutput(dataOutput)
      .addOutput(resultOutput)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    const rpcHttp = node.data?.rpc_http as string

    const contractAddress = (inputs['tx'] && inputs['tx'][0]) as string
    const contractAbi = (inputs['abi'] && inputs['abi'][0]) as string

      return {
        output: data,
      }
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
