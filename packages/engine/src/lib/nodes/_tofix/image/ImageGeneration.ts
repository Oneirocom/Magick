import Rete from 'rete'

import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../../types'
import { stringSocket, triggerSocket } from '../../../sockets'
import { MagickComponent } from '../../../magick-component'
import { API_ROOT_URL } from '../../../config'

const info =
  'Leverages the current Automatic1111 build of Stable Diffusion (https://github.com/automatic1111/stable-diffusion-webui) and takes an input string and arbitrary labels and returns the most likely label'

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

export class ImageGeneration extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Generate Image', {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }, 'Image', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const promptInput = new Rete.Input('prompt', 'Prompt', stringSocket, true)
    const endpointInput = new Rete.Input('endpoint', 'Endpoint', stringSocket)
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addInput(triggerInput)
      .addInput(promptInput)
      .addInput(endpointInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    const prompt = inputs['prompt'] && inputs['prompt'][0]
    const endpoint = inputs['endpoint'] && inputs['endpoint'][0]

    const server = endpoint ?? `${API_ROOT_URL}/image_generation`

    const { images } = await getPrompt(prompt, server)
    const image = images && images[0]

    return { output: image }
  }
}
