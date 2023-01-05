import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info =
  'Webaverse Image Generation node, leverages the current Webaverse build of Stable Diffusion (https://github.com/webaverse/stable-diffusion-webui) and takes an input string and arbitrary labels and returns the most likely label'

type InputReturn = {
  output: unknown
}

async function getPrompt(prompt, server) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    prompt,
    sampler_name: 'Euler a',
    batch_size: 1,
    n_iter: 1,
    steps: 50,
    cfg_scale: 7,
    width: 256,
    height: 256,
    tiling: false,
    sampler_index: 'Euler',
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  const r = await fetch(server, requestOptions as any).catch(error =>
    console.log('error', error)
  )

  const j = await (r as Response).json()
  console.log('j is', j)
  return j
}

export class ImageGeneration extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Image Generation')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const promptInput = new Rete.Input('prompt', 'Prompt', stringSocket, true)
    const endpointInput = new Rete.Input('endpoint', 'Endpoint', stringSocket)
    // eslint-disable-next-line prettier/prettier
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addOutput(output)
      .addOutput(dataOutput)
      .addInput(promptInput)
      .addInput(triggerInput)
      .addInput(endpointInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean; magick: EngineContext }
  ) {
    const prompt = inputs['prompt'] && inputs['prompt'][0]
    const endpoint = inputs['endpoint'] && inputs['endpoint'][0]

    const server = endpoint ?? 'https://localhost:8001/image_generation'

    const { images } = await getPrompt(prompt, server)
    const image = images && images[0]

    if (!silent) {
      if (!image) node.display('Error: No data returned', image)
      else node.display('Response is', image)
    }

    return { output: image }  }
}
