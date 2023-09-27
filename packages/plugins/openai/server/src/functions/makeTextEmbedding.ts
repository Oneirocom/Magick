// DOCUMENTED
import {
  CompletionHandlerInputData,
  EmbeddingModel,
  saveRequest,
} from '@magickml/core'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'
import { DEFAULT_OPENAI_KEY } from 'shared/config'
import { trackOpenAIUsage } from '@magickml/server-core'

/**
 * A function that makes a request to create a text embedding using OpenAI's
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
  model?: string
  totalTokens?: number
}> {
  const { node, inputs, context } = data

  const input = inputs['input'] && inputs['input'][0]
  if (!input) {
    return {
      success: false,
      error: 'Input text is required to create a text embedding',
    }
  }

  const apiKey =
    (context?.module?.secrets && context?.module?.secrets['openai_api_key']) ||
    DEFAULT_OPENAI_KEY

  if (!apiKey) {
    return {
      success: false,
      error: 'OpenAI API key is required to create a text embedding',
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  }

  const requestData = { input: input, model: node.data.model }

  // Start a timer
  const start = Date.now()
  try {
    // Make a POST request to the OpenAI endpoint
    const resp = await axios.post(
      `${OPENAI_ENDPOINT}/embeddings`,
      requestData,
      { headers: headers }
    )

    const spell = context.currentSpell
    const model = node.data.model as EmbeddingModel
    const projectId = context.projectId

    // Save request information
    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(requestData),
      responseData: JSON.stringify(resp.data).slice(0, 10),
      startTime: start,
      statusCode: resp.status,
      status: resp.statusText,
      model: model,
      parameters: '{}',
      type: 'embedding',
      provider: 'openai',
      hidden: false,
      processed: false,
      totalTokens: resp.data.usage.total_tokens,
      spell,
      nodeId: node.id,
    })

    // Save to metering
    trackOpenAIUsage({
      projectId: context.projectId,
      model,
      totalTokens: resp.data.usage.total_tokens,
    })

    return {
      success: true,
      result: resp.data.data[0].embedding,
      model: model,
      totalTokens: resp.data.usage.total_tokens,
    }
  } catch (err: any) {
    console.error('makeTextEmbedding error:', err)
    return { success: false, error: err.message }
  }
}
