import { CompletionHandlerInputData, saveRequest } from '@magickml/engine'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'

export async function makeTextCompletion(
  data: CompletionHandlerInputData
): Promise<{success: boolean, result?: string | null, error?: string | null}> {
  const { node, inputs, context } = data

  const { projectId, magick } = context

  const spell = magick.getCurrentSpell()

  const prompt = inputs['input'][0]

  const settings = ((inputs.settings && inputs.settings[0]) ?? {
    model: node?.data?.model,
    temperature: node?.data?.temperature,
    max_tokens: node?.data?.max_tokens,
    top_p: node?.data?.top_p,
    frequency_penalty: node?.data?.frequency_penalty,
    presence_penalty: node?.data?.presence_penalty,
    stop: node?.data?.stop,
  }) as any

  settings.prompt = prompt

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + context.module.secrets['openai_api_key'],
  }

  try {
    const start = Date.now()
    const resp = await axios.post(`${OPENAI_ENDPOINT}/completions`, settings, {
      headers: headers,
    })

    const usage = resp.data.usage

    console.log('data', data)
    console.log('responseData', resp.data)
    console.log('settings', settings)

    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(resp.data),
      startTime: start,
      statusCode: resp.status,
      status: resp.statusText,
      model: settings.model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'openai',
      totalTokens: usage.total_tokens,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      console.log('choice', choice)
      return { success: true, result: choice.text }
    }
    return { success: false, error: 'No choices returned' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
