// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'
import { BANANA_ENDPOINT } from '../constants'
import { run, start, check } from '@banana-dev/banana-dev'

/**
 * Makes an API request to an AI speech completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function dollyTextCompletion(
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
  // Get the input text prompt.
  console.log('inputs are', inputs)
  const prompt = inputs['input'][0]

  const requestData = {
    model: node?.data?.model,
    do_sample: (node?.data?.do_sample as string) === 'true' ? true : false,
    max_new_tokens: parseFloat((node?.data?.max_new_tokens as string) ?? '256'),
    top_p: parseFloat((node?.data?.top_p as string) ?? '0.92'),
    top_k: parseFloat((node?.data?.top_k as string) ?? '0'),
  }

  // Get the settings object, setting default values if necessary.
  // const settings = requestData as any

  // Add the prompt to the settings object.
  // settings.prompt = prompt

  // Make the API request and handle the response.
  try {
    const start = Date.now()

    const modelInputs = {
      prompt,
      do_sample: requestData.do_sample,
      max_new_tokens: requestData.max_new_tokens,
      top_p: requestData.top_p,
      top_k: requestData.top_k,
    }

    // {
    //   id: 'd4a945c6-aca2-49ca-ab8a-3ae83327e571',
    //   message: '',
    //   created: 1681570588,
    //   apiVersion: 'January 11, 2023',
    //   modelOutputs: [
    //     {
    //       outputs: 'I am pleased to inform you that your application for visa on business has been approved. The visa fee is 499$.'
    //     }
    //   ]
    // }

    type ModelOutput = {
      id: string
      message: string
      created: number
      apiVersion: string
      modelOutputs: {
        outputs: string
      }[]
    }

    const outputs = (await run(
      context.module.secrets['banana_api_key'],
      context.module.secrets['banana_flan_key'],
      modelInputs
    )) as ModelOutput

    console.log(outputs)

    // const usage = resp.data.usage

    // Save the request data for future reference.
    // saveRequest({
    //   projectId: projectId,
    //   // requestData: JSON.stringify(settings),
    //   requestData: JSON.stringify('heya'),
    //   responseData: JSON.stringify(resp.data),
    //   startTime: start,
    //   statusCode: resp.status,
    //   status: resp.statusText,
    //   model: 'stable-diffusion-1-5',
    //   // parameters: JSON.stringify(settings),
    //   parameters: JSON.stringify('heya'),
    //   type: 'completion',
    //   provider: 'docker-diffusers',
    //   totalTokens: 0,
    //   hidden: false,
    //   processed: false,
    //   spell,
    //   nodeId: node.id as number,
    // })

    // Check if choices array is not empty, then return the result.
    // if (resp.data.choices && resp.data.choices.length > 0) {
    //   const choice = resp.data.choices[0]
    //   console.log('choice', choice)
    //   return { success: true, result: choice.text }
    // }
    // If no choices were returned, return an error.
    // return { success: false, error: 'No choices returned' }

    return { success: true, result: outputs.modelOutputs[0].outputs }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
