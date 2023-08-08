// DOCUMENTED
import { CompletionHandlerInputData } from '@magickml/core'
import metaphor from 'metaphor-node'
/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function makeMetaphorSearch(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  results?: any[]
  message?: string
  error?: string | null
  model?: string
  totalTokens?: number
}> {
  // Destructure necessary properties from the data object.
  const { inputs, context } = data
  const query = inputs['query'][0] as string

  // get secret
  const metaphorApiKey = context.module.secrets!['metaphor_api_key']

  const client = new metaphor(metaphorApiKey)

  try {
    const response = await client.search(query)

    return {
      success: true,
      results: response.results,
      message: response.autopromptString,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
