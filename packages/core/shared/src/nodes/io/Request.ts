// DOCUMENTED
import axios, { AxiosResponse } from 'axios'
import Rete from 'shared/rete'
import { API_ROOT_URL } from '@magickml/config'

import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

// Request component info
const info =
  'Allows you to make HTTP web requests to a server specified in the URL property. The Headers property accepts a JSON formatted object of key-value paired headers. The Method property is the HTTP method to be used (such as GET or POST). The body inputs allow you to pass any number of inputs which will be sent as query parameters for GET/PUT requests and as a formatted key/value body for all other request methods.'

// Worker return type
type WorkerReturn = {
  output: unknown
}

/**
 * Request component for making web requests.
 */
export class Request extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Creates a new instance of the Request component.
   */
  constructor() {
    super(
      'Request',
      { outputs: { output: 'output', trigger: 'option' } },
      'Invoke/Network',
      info
    )
  }

  /**
   * Builds the node for the Request component.
   * @param node The node to build.
   * @returns The built node.
   */
  builder(node: MagickNode): MagickNode {
    // Initialize node inputs and outputs
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', objectSocket)

    const headerInput = new Rete.Input('headers', 'Headers', objectSocket)
    const urlInput = new Rete.Input('url', 'URL', stringSocket)
    const paramsInput = new Rete.Input('params', 'Params', objectSocket)

    // Initialize controls used in the node
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
      tooltip: 'Enter Component name',
    })
    const headers = new InputControl({
      dataKey: 'headers',
      name: 'Headers',
      tooltip: 'Headers for the input request',
    })
    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Body Inputs',
      ignored: ['trigger'],
      tooltip: 'Add body inputs for the request',
    })
    const url = new InputControl({
      dataKey: 'url',
      name: 'URL',
      icon: 'moon',
      tooltip: 'url for the input request',
    })
    const method = new InputControl({
      dataKey: 'method',
      name: 'method',
      icon: 'moon',
      tooltip: 'Method for the input request',
    })

    // Add inputs and outputs to the node and configure node inspector
    node
      .addInput(dataInput)
      .addInput(headerInput)
      .addInput(urlInput)
      .addInput(paramsInput)
      .addOutput(dataOutput)
      .addOutput(outp)
    node.inspector
      .add(nameControl)
      .add(headers)
      .add(inputGenerator)
      .add(url)
      .add(method)

    return node
  }

  /**
   * Handles the worker logic for the Request component.
   * @param node The current node data.
   * @param rawInputs The worker inputs.
   * @param _outputs The worker outputs.
   * @returns The processed worker data.
   */
  async worker(
    node: WorkerData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    // Extract node and input data
    const name = node.data.name as string
    node.name = name

    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    // Parse headers or set an empty object if headers not provided
    const headers =
      inputs['headers'] ??
      (node.data.headers && node.data.headers !== ''
        ? JSON.parse((node.data.headers as string) ?? '{}')
        : {})

    // Fetch URL and method from the node data
    let url = (inputs['url'] as string) ?? (node?.data?.url as string)
    const method =
      (inputs['method'] as string) ??
      (node?.data?.method as string)?.toLowerCase().trim()
    if (url.startsWith('server')) {
      url = url.replace('server', API_ROOT_URL as string)
    }

    // Perform the desired web request based on the method
    let resp: AxiosResponse<unknown> | undefined
    if (method === 'post') {
      resp = await axios.post(url, inputs, { headers })
    } else if (method === 'get') {
      resp = await axios.get(url, { params: inputs, headers })
    } else if (method === 'delete') {
      resp = await axios.delete(url, { params: inputs, headers })
    } else if (method === 'put') {
      resp = await axios.put(url, inputs, { headers })
    } else if (method === 'head') {
      resp = await axios.head(url, { params: inputs, headers })
    } else {
      throw new Error(`Request Method (${method}) not supported!`)
    }

    // Return processed response data
    return { output: resp ? resp.data : '' }
  }
}
