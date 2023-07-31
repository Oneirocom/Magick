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
    num_generations: 1,
    max_tokens: (node?.data?.max_tokens as number) ?? 20,
    temperature: (node?.data?.temperature as number) ?? 0.75,
    k: (node?.data?.k as number) ?? 0,
    p: (node?.data?.p as number) ?? 0.75,
    frequency_penalty: (node?.data?.frequency_penalty as number) ?? 0,
    presence_penalty: (node?.data?.presence_penalty as number) ?? 0,
    end_sequences: (node?.data?.end_sequences as string)
      ? (node?.data?.end_sequences as string).split(',')
      : [],
    stop_sequences: (node?.data?.stop_sequences as string)
      ? (node?.data?.stop_sequences as string).split(',')
      : [],
    return_likelihoods: (node?.data?.return_likelihoods as string) ?? 'NONE',
    truncate: (node?.data?.truncate as string) ?? 'END',
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
    const generateResponse = await cohere.generate(requestData as any)

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(requestData),
      responseData: JSON.stringify(generateResponse),
      startTime: start,
      statusCode: generateResponse.statusCode,
      status: generateResponse.statusCode === 200 ? 'success' : 'error',
      model: requestData.model,
      parameters: JSON.stringify({
        max_tokens: requestData.max_tokens,
        temperature: requestData.temperature,
        k: requestData.k,
        p: requestData.p,
        frequency_penalty: requestData.frequency_penalty,
        presence_penalty: requestData.presence_penalty,
        end_sequences: requestData.end_sequences,
        stop_sequences: requestData.stop_sequences,
        return_likelihoods: requestData.return_likelihoods,
        truncate: requestData.truncate,
      }),
      type: 'completion',
      provider: 'cohere',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id,
    })

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
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
