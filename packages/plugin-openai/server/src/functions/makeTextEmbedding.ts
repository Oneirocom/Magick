import { EmbeddingModel } from '@magickml/cost-calculator'
import { CompletionHandlerInputData, saveRequest } from '@magickml/engine'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'

export async function makeTextEmbedding(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  const { node, inputs, context } = data

  let input = (inputs['input'] && inputs['input'][0]) as Object;
  input = (input as {content: string})?.content;
  if (!input) {
    return {
      success: false,
      error: 'Content is null, not storing event',
    }
  }
  const apiKey = context.module.secrets['openai_api_key']

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  }

  const requestData = { input: input, model: node.data.model }

  // start a timer
  const start = Date.now()
  try {
    const resp = await axios.post(
      `${OPENAI_ENDPOINT}/embeddings`,
      requestData,
      { headers: headers }
    )
    const spell = context.magick.getCurrentSpell()
    const model = node.data.model as EmbeddingModel

    const projectId = context.projectId

    saveRequest({
      projectId: projectId,
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
    return { success: true, result: resp.data.data[0].embedding }
  } catch (err: any) {
    console.log(err.response.data.error)
    console.error('makeTextEmbedding error:', err)
    return { success: false, error: err.message }
  }
}
