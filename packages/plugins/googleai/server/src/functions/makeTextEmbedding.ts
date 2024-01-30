// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import { GOOGLEAI_ENDPOINT } from '../constants'
import { trackGoogleAIUsage } from 'server/core'
import { wordCount } from './shared'
import { DEFAULT_GOOGLEAI_API_KEY } from 'shared/config'
import { EmbeddingModels } from 'plugins/core/src/lib/services/coreEmbeddingService/types'

/**
 * A function that makes a request to create a text embedding using GoogleAI's
 * embeddings microservice. The input text is passed to the service along with
 * a specified model which provides the text embedding. Information about the
 * request is then saved (e.g. status code, response, etc.).
 *
 * @export
 * @param {CompletionHandlerInputData} data - The necessary data to send the request,
 *                         including input text, model, and relevant http headers
 * @returns {Promise<{ success: boolean, result?: string | null, error?: string | null }>}
 *           - A promise containing the embedding or an error.
 */
export async function makeTextEmbedding(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: number[] | null
  error?: string | null
}> {
  const { node, inputs, context } = data

  const input = inputs['input'] && (inputs['input'][0] as string)
  if (!input) {
    return {
      success: false,
      error: 'Input text is required to create a text embedding',
    }
  }

  const apiKey =
    (context?.module?.secrets &&
      context?.module?.secrets['googleai_api_key']) ||
    DEFAULT_GOOGLEAI_API_KEY ||
    null

  if (!apiKey) {
    return {
      success: false,
      error: 'GoogleAI API key is required to create a text embedding',
    }
  }

  // Start a timer
  const start = Date.now()
  try {
    const settings = {
      model: node?.data?.model,
      text: input,
    }

    const endpoint = `${GOOGLEAI_ENDPOINT}/${node?.data?.model}:embedText?key=${apiKey}`
    // Make the API call to GoogleAI
    const completion = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    const completionData = await completion.json()

    const result = completionData.embedding?.value

    saveRequest({
      projectId: context.projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(completionData),
      startTime: start,
      statusCode: completion.status,
      status: completion.statusText,
      model: node.data.model as EmbeddingModels,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'googleai',
      totalTokens: 0, // usage.total_tokens,
      hidden: false,
      processed: false,
      spell: context.currentSpell,
      nodeId: node.id,
    })

    // Save metering event
    trackGoogleAIUsage({
      projectId: context.projectId,
      model: node?.data?.model as string,
      callCount: 1,
      wordCount: wordCount(input),
    })

    if (result) {
      return { success: true, result }
    }

    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error('makeTextEmbedding error:', err)
    return { success: false, error: err.message }
  }
}
