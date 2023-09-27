// DOCUMENTED
import { CompletionHandlerInputData } from 'shared/core'
import metaphor from 'metaphor-node'
import { saveRequest } from 'shared/core'

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
  const { inputs, context, node } = data
  const { projectId, currentSpell } = context
  // Set the current spell for record keeping.
  const spell = currentSpell
  const query = inputs['query'][0] as string

  // get secret
  const metaphorApiKey = context.module.secrets!['metaphor_api_key']

  const client = new metaphor(metaphorApiKey)

  try {
    const response = await client.search(query, {
      useAutoprompt: true,
    })
    const start = Date.now()

    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(query),
      responseData: JSON.stringify(response),
      startTime: start,
      statusCode: response.results.length > 0 ? 200 : 404,
      status: response.results.length > 0 ? 'success' : 'error',
      model: 'metaphor',
      parameters: JSON.stringify({}),
      type: 'search',
      provider: 'metaphor',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })
    return {
      success: true,
      results: response.results,
      message: response.autopromptString,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
