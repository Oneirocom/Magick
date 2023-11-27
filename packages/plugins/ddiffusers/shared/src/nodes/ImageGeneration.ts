import Rete from '@magickml/rete'
import {
  MagickComponent,
  stringSocket,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
  arraySocket,
} from '@magickml/core'
import {
  getDiffusersInputsControls,
  getTriggerInputSocket,
  getTriggerOutputSocket,
  setDefaultDiffusersInputs,
} from './config'
import { DiffusersInputs } from '../types'
import { generateImage } from '../functions'
import { AWS_BUCKET_PREFIX } from '@magickml/config'

const info = 'Generates an image based on the given parameters and inputs.'

type InputReturn = {
  images: string[]
}

export class ImageGeneration extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Generate Image',
      {
        outputs: {
          images: 'output',
          trigger: 'option',
        },
      },
      'AI/Image',
      info
    )
    this.common = true
  }

  builder(node: MagickNode) {
    // add sockets
    const output = new Rete.Output('images', 'Images', arraySocket)
    const inputTrigger = getTriggerInputSocket()
    const outputTrigger = getTriggerOutputSocket()
    const promptSocket = new Rete.Input('prompt', 'Prompt', stringSocket)

    // set default data
    node.data['diffusersInputs'] = node.data['diffusersInputs'] || {}
    const existingData =
      (node.data[
        'diffusersInputs' as keyof DiffusersInputs
      ] as Partial<DiffusersInputs>) || {}
    const defaultData = setDefaultDiffusersInputs(existingData)

    node.data['diffusersInputs'] = {
      ...existingData,
      ...defaultData,
    }

    const initialInputs =
      node.data['diffusersInputs' as keyof DiffusersInputs] || {}
    // const defaultInputs = setDefaultDiffusersInputs(initialInputs)

    // add controls
    const { callInputs, modelInputs, extraInputs } =
      //   getDiffusersInputsControls(defaultInputs)
      getDiffusersInputsControls(initialInputs)
    ;[...callInputs, ...modelInputs, ...extraInputs].forEach(control =>
      node.inspector.add(control)
    )

    const handleImageSocket = (value: string) => {
      if (
        value === 'StableDiffusionImg2ImgPipeline' ||
        value === 'StableDiffusionInpaintPipeline'
      ) {
        if (!node.inputs.has('imageUrl')) {
          console.log('adding image socket')
          node.addInput(new Rete.Input('imageUrl', 'Image Url', stringSocket))
        }
      } else {
        if (node.inputs.has('imageUrl')) {
          console.log('removing image socket')
          node.inputs.delete('imageUrl')
        }
      }
    }

    callInputs[1].onData = (value: string) => {
      handleImageSocket(value)
    }

    handleImageSocket(
      (node.data['diffusersInputs'] as DiffusersInputs).callInputs.PIPELINE ||
        'StableDiffusionPipeline'
    )

    return node
      .addInput(inputTrigger)
      .addInput(promptSocket)
      .addOutput(outputTrigger)
      .addOutput(output)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: any
  ) {
    const { app } = context.module
    const diffusersInputs = (node.data as { diffusersInputs: DiffusersInputs })
      .diffusersInputs
    if (!inputs['prompt']) {
      throw new Error('Prompt is required')
    }
    const prompt = inputs['prompt'][0] as string

    const { modelInputs, callInputs, extraInputs } = diffusersInputs

    modelInputs.prompt = prompt
    console.log('modelInputs', modelInputs)
    console.log('callInputs', callInputs)
    console.log('extraInputs', extraInputs)

    const output = await generateImage({ modelInputs, callInputs, extraInputs })

    if (!output.data.image_base64) {
      throw new Error('Image generation failed')
    }

    const generation = await app.service('generations').create({
      projectId: context.projectId,
      model: callInputs.MODEL_ID,
      type: 'image',
      files: output.data.image_base64
        ? [output.data.image_base64]
        : output.data.image_base64,
    })

    if (!generation) {
      throw new Error('Image generation failed')
    }

    // add prefix to image paths
    generation.paths = generation.paths.map(
      path => `${AWS_BUCKET_PREFIX}/${path}`
    )

    return {
      images: generation.paths,
    }
  }
}
