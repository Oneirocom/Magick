// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'
import { BANANA_ENDPOINT } from '../constants'
import { run, start, check } from '@banana-dev/banana-dev'

/**
 * Makes an API request to an AI image completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function imageToTextCompletion(
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
  console.log('inputs', inputs)
  // const prompt = inputs['input'][0]
  // console.log('prompt', prompt)

  const requestData = {
    // model: node?.data?.model,
    // temperature: parseFloat((node?.data?.temperature as string) ?? '0'),
    // max_tokens: parseFloat((node?.data?.max_tokens as string) ?? '100'),
    // top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
    // frequency_penalty: parseFloat(
    //   (node?.data?.frequency_penalty as string) ?? '0.0'
    // ),
    // presence_penalty: parseFloat(
    //   (node?.data?.presence_penalty as string) ?? '0.0'
    // ),
    // stop: node?.data?.stop,
  }

  console.log('data is', requestData)

  // Get the settings object, setting default values if necessary.
  // const settings = requestData as any

  // Add the prompt to the settings object.
  // settings.prompt = prompt

  // Make the API request and handle the response.
  try {
    const start = Date.now()
    // const resp = await axios.post(
    //   `${BANANA_ENDPOINT}/`,
    //   {
    //     apiKey: context.module.secrets['docker-diffusers-api-key'],
    //     modelKey: context.module.secrets['docker-diffusers-model-key'],
    //     modelInputs: {
    //       prompt: 'puppy swimming in the ocean',
    //     },
    //   },
    //   {
    //     headers: headers,
    //   }
    // )

    const modelInputs = {
      text: 'Is this a wizard?',
      imageURL:
        'https://framerusercontent.com/images/db7Ov2StIfwvBuvoK5FMFhD6zg.png',
      similarity: false,
      maxLength: 100,
      minLength: 30,
    }

    const outputs = await run(
      context.module.secrets['banana_api_key'],
      context.module.secrets['banana_carrot_key'],
      modelInputs
    )

    console.log('image2text outputs', outputs)

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

    return { success: true, result: outputs }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
