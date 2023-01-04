import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Webaverse Image Generation node, leverages the current Webaverse build of Stable Diffusion (https://github.com/webaverse/stable-diffusion-webui) and takes an input string and arbitrary labels and returns the most likely label'

type InputReturn = {
  output: unknown
}

async function getPrompt(prompt, server) {
  const r = await fetch(server + '/run/txt2img', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        prompt,
        '',
        'None',
        'None',
        20,
        'Euler a',
        false,
        false,
        1,
        1,
        7,
        -1,
        -1,
        0,
        0,
        0,
        false,
        512,
        512,
        false,
        0.7,
        0,
        0,
        'None',
        false,
        false,
        false,
        'hello world',
        'Nothing',
        'hello world',
        'Nothing',
        'hello world',
        true,
        false,
        false,
      ],
    }),
  })

  const j = await r.json()
  const data = j.data
  const imgUrl = `${server}/file=${data[0][0].name}`
  return imgUrl
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
    { silent }: { silent: boolean; thoth: EngineContext }
  ) {
    const prompt = inputs['prompt'] && inputs['prompt'][0]
    const endpoint = inputs['endpoint'] && inputs['endpoint'][0]

    const server = endpoint ?? 'https://stable-diffusion.webaverse.com'

    const imgUrl = await getPrompt(prompt, server)

    if (!silent) {
      if (!imgUrl) node.display('Error: No data returned', imgUrl)
      else node.display('Response is', imgUrl)
    }
    console.log('Respone is', imgUrl)
    return { output: imgUrl }
  }
}
