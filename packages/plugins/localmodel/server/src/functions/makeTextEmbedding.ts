// DOCUMENTED
import {
  CompletionHandlerInputData,
  EmbeddingModel,
  saveRequest,
} from 'shared/core'
import axios from 'axios'
import { LOCALMODEL_ENPOINT } from '../constants'

/**
 * A function that makes a request to create a text embedding using the
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

  const input = inputs['input'] && inputs['input'][0]
  if (!input) {
    return {
      success: false,
      error: 'Input text is required to create a text embedding',
    }
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  const requestData = { input: input, model: node.data.model }

  // Start a timer
  const start = Date.now()
  try {
    // Make a POST request to the local endpoint
    const resp = await axios.post(
      `${LOCALMODEL_ENPOINT}/embeddings`,
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
      provider: 'localmodel',
      hidden: false,
      processed: false,
      totalTokens: resp.data.usage.total_tokens,
      spell,
      nodeId: node.id,
    })
    return { success: true, result: resp.data.data[0].embedding }
  } catch (err: any) {
    console.error('makeTextEmbedding error:', err)
    return { success: false, error: err.message }
  }
}
