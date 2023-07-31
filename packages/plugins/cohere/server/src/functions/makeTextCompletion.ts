// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import cohere from 'cohere-ai'

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function makeTextCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  results?: string[] | null
  error?: string | null
  model?: string
  totalTokens?: number
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  console.log('makeTextCompletion', data)

  // Set the current spell for record keeping.
  const spell = currentSpell

  // Get the input text prompt.
  const prompt = inputs['input'][0] as string
  const model = node?.data?.model as string

  const requestData = {
    prompt,
    model: model.replace('cohere-', ''),
  }

  // const requestData = {
  //   model: node?.data?.model,
  //   temperature: parseFloat((node?.data?.temperature as string) ?? '0'),
  //   max_tokens: parseFloat((node?.data?.max_tokens as string) ?? '100'),
  //   top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
  //   frequency_penalty: parseFloat(
  //     (node?.data?.frequency_penalty as string) ?? '0.0'
  //   ),
  //   presence_penalty: parseFloat(
  //     (node?.data?.presence_penalty as string) ?? '0.0'
  //   ),
  //   stop: node?.data?.stop,
  // }

  // Get the settings object, setting default values if necessary.
  // const settings = requestData as any

  // Add the prompt to the settings object.
  // settings.prompt = prompt

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const cohereKey = context.module.secrets!['cohere_api_key']
  cohere.init(cohereKey)

  // Make the API request and handle the response.
  try {
    const start = Date.now()
    const generateResponse = await cohere.generate({
      model: requestData.model,
      prompt,
      max_tokens: 50,
      temperature: 1,
      num_generations: 2,
    })

    console.log(generateResponse)

    // switch on status code
    switch (generateResponse.statusCode) {
      case 200:
        break
      case 400:
        return {
          success: false,
          error: 'Bad request',
        }
      case 429:
        return {
          success: false,
          error: 'Cohere rate limit exceeded',
        }
      case 498:
        return {
          success: false,
          error: 'Blocked input or output',
        }
      case 500:
        return {
          success: false,
          error: 'Internal server error',
        }
      default:
        return {
          success: false,
          error: 'Unknown error',
        }
    }

    return {
      success: true,
      result: generateResponse.body.generations[0].text,
      results: generateResponse.body.generations.map(g => g.text),
    }
    // const usage = resp.data.usage

    // Save the request data for future reference.
    // saveRequest({
    //   projectId: projectId,
    //   requestData: JSON.stringify(settings),
    //   responseData: JSON.stringify(resp.data),
    //   startTime: start,
    //   statusCode: resp.status,
    //   status: resp.statusText,
    //   model: settings.model,
    //   parameters: JSON.stringify(settings),
    //   type: 'completion',
    //   provider: 'cohere',
    //   totalTokens: usage.total_tokens,
    //   hidden: false,
    //   processed: false,
    //   spell,
    //   nodeId: node.id as number,
    // })

    // Check if choices array is not empty, then return the result.
    // if (resp.data.choices && resp.data.choices.length > 0) {
    //   const choice = resp.data.choices[0]
    //   return {
    //     success: true,
    //     result: choice.text,
    //     model: settings.model,
    //     totalTokens: usage.total_tokens,
    //   }
    // }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
