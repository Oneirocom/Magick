import axios, { AxiosResponse } from 'axios'
import {
  ModelInputs,
  CallInputs,
  DiffusersInputs,
  DiffusersOutputs,
} from '../types'
import { DDIFFUSERS_API_URL, DDIFFUSERS_KEY } from '@magickml/config'

export const generateImage = async ({
  callInputs,
  modelInputs,
  extraInputs,
}: DiffusersInputs): Promise<AxiosResponse<DiffusersOutputs>> => {
  const headers = {
    Authorization: `Bearer ${DDIFFUSERS_KEY}`,
  }

  const inputs = { callInputs, modelInputs, extraInputs }

  if (
    inputs.callInputs.attn_procs === '' ||
    inputs.modelInputs.cross_attention_kwargs === ''
  ) {
    delete inputs.callInputs.attn_procs
    delete inputs.callInputs.PIPELINE
  }

  inputs.callInputs = {
    ...callInputs,
    ...extraInputs,
  }

  // @ts-ignore
  // inputs.callInputs.PIPELINE = 'StableDiffusionXLPipeline'
  // inputs.callInputs.MODEL_ID = 'stablediffusionapi/juggernaut-xl-v5'
  // inputs.modelInputs.width = 1024
  // inputs.modelInputs.height = 1280
  console.log('inputs', inputs)

  const test: Partial<DiffusersInputs> = {
    modelInputs: {
      prompt:
        'front shot, portrait photo of a cute 22 y.o woman, looks away, full lips, natural skin, skin moles, stormy weather, (cinematic, film grain:1.1)',
      negative_prompt:
        '(worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch), open mouth',
      num_inference_steps: 25,
      guidance_scale: 7.5,
      width: 1024,
      height: 1024,
    },
    callInputs: {
      MODEL_ID: 'stablediffusionapi/copax-timelessxl-sdxl10',
      // @ts-ignore
      // PIPELINE: 'StableDiffusionXLPipeline',
      SCHEDULER: 'DPMSolverMultistepScheduler',
    },
  }

  try {
    const response = (await axios.post(DDIFFUSERS_API_URL, test, {
      headers,
    })) as AxiosResponse<DiffusersOutputs>

    return response
  } catch (error) {
    throw new Error(`Image generation failed: ${error}`)
  }
}
