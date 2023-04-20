// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'
import { BANANA_ENDPOINT } from '../constants'
import { run, start, check } from '@banana-dev/banana-dev'

/**
 * Makes an request to a riffusion completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function textToAudioCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: Object | null
  error?: string | null
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  // Set the current spell for record keeping.
  const spell = currentSpell
  // Get the input text prompts.
  console.log('inputs are', inputs)
  const start_prompt = inputs['start_prompt'][0]
  const end_prompt = inputs['end_prompt'][0]

  const modelInputs = {
    // model: node?.data?.model,
    alpha: parseFloat((node?.data?.alpha as string) ?? '0.75'),
    num_inference_steps: parseFloat(
      (node?.data?.num_inference_steps as string) ?? '50'
    ),
    seed_image_id: node?.data?.seed_image_id,
    start: {
      prompt: start_prompt,
      seed: parseFloat((node?.data?.start_seed as string) ?? '42'),
      denoising: parseFloat((node?.data?.start_denoising as string) ?? '0.75'),
      guidance: parseFloat((node?.data?.start_guidance as string) ?? '7'),
    },
    end: {
      prompt: end_prompt,
      seed: parseFloat((node?.data?.end_seed as string) ?? '123'),
      denoising: parseFloat((node?.data?.end_denoising as string) ?? '0.75'),
      guidance: parseFloat((node?.data?.end_guidance as string) ?? '7'),
    },
  }

  // Make the API request and handle the response.
  try {
    const start = Date.now()
    type ModelOutput = {
      id: string
      message: string
      created: number
      apiVersion: string
      modelOutputs: {
        image: string
        audio: string
      }[]
    }

    const outputs = (await run(
      // @ts-ignore
      context.module.secrets['banana_api_key'],
      // @ts-ignore
      context.module.secrets['banana_riffusion_key'],
      modelInputs
    )) as ModelOutput

    console.log(outputs)

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      // requestData: JSON.stringify(settings),
      requestData: JSON.stringify(modelInputs),
      responseData: JSON.stringify(outputs),
      startTime: start,
      statusCode: 200,
      status: 'success',
      model: 'riffusion',
      parameters: JSON.stringify(modelInputs),
      type: 'completion',
      provider: 'banana',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    // // Check if choices array is not empty, then return the result.
    // if (resp.data.choices && resp.data.choices.length > 0) {
    //   const choice = resp.data.choices[0]
    //   console.log('choice', choice)
    //   return { success: true, result: choice.text }
    // }
    // // If no choices were returned, return an error.
    // return { success: false, error: 'No choices returned' }

    return { success: true, result: outputs.modelOutputs[0].audio as string }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
