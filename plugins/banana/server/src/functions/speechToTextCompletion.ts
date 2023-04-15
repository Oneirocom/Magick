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
export async function speechToTextCompletion(
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

    const outputs = await run(
      context.module.secrets['banana_api_key'],
      context.module.secrets['banana_whisper_key'],

      {
        base64String:
          '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',
      }
    )

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
