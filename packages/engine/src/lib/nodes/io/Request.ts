/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios'
import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  EngineContext, MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs, WorkerData
} from '../../types'

const info = 'Request is used to make a web request to a server.'

type WorkerReturn = {
  output: any
}

export class Request extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Request', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'I/O', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    const url = new InputControl({
      dataKey: 'url',
      name: 'URL',
      icon: 'moon',
    })

    const method = new InputControl({
      dataKey: 'method',
      name: 'method',
      icon: 'moon',
    })

    node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(url)
      .add(method)

    return node
  }

  async worker(
    node: WorkerData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    const { env } = magick
    const name = node.data.name as string
    node.name = name

    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    let url = node?.data?.url as string
    const method = (node?.data?.method as string)?.toLowerCase().trim()
    if (url.startsWith('server')) {
      url = url.replace('server', env.API_ROOT_URL as string)
    }

    let resp = undefined as any
    if (method === 'post') {
      resp = await axios.post(url, inputs)
    } else if (method === 'get') {
      resp = await axios.get(url, { params: inputs })
    } else if (method === 'delete') {
      resp = await axios.delete(url, { params: inputs })
    } else if (method === 'put') {
      resp = await axios.put(url, inputs)
    } else if (method === 'head') {
      resp = await axios.head(url, { params: inputs })
    } else {
      console.log('Request Method (' + method + ') not supported!')
    }

    return {
      output: resp ? (resp.data as any) : '',
    }
  }
}
