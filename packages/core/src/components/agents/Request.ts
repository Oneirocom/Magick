process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Request is used to make a web request to a server.'

type WorkerReturn = {
  output: any
}

export class Request extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Request')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
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

    node.inspector.add(nameControl).add(inputGenerator).add(url).add(method)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(outp)
  }

  async worker(node: NodeData, rawInputs: ThothWorkerInputs) {
    const name = node.data.name as string
    node.name = name

    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    let url = node?.data?.url as string
    const method = (node?.data?.method as string)?.toLowerCase().trim()
    if (url.startsWith('server')) {
      url = url.replace('server', process.env.REACT_APP_API_URL as string)
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
