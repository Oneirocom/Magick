import axios from 'axios'
import { OPENAI_ENDPOINT } from '../config'
import { saveRequest } from './saveRequest'
import {
  calculateCompletionCost,
  CompletionModel,
} from '@magickml/cost-calculator'

export type CompletionData = {
  model: string
  prompt: string
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  apiKey?: string
}

export async function makeCompletion(
  data: CompletionData,
  { projectId, spell, nodeId }
): Promise<{success:boolean, choice?: {text:string}}> {
  const {
    prompt,
    model,
    temperature = 0.7,
    max_tokens = 100,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0,
    stop,
    apiKey,
  } = data
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  }

  try {
    const start = Date.now()
    const resp = await axios.post(
      `${OPENAI_ENDPOINT}/completions`,
      {
        prompt,
        model,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
        stop,
      },
      { headers: headers }
    )
    const end = Date.now()

    const completionModel = model.includes('gpt-4')
      ? CompletionModel.GPT4
      : model.includes('davinci')
      ? CompletionModel.DAVINCI
      : model.includes('curie')
      ? CompletionModel.CURIE
      : model.includes('babbage')
      ? CompletionModel.BABBAGE
      : CompletionModel.ADA

    const usage = resp.data.usage

    const totalCost = calculateCompletionCost({
      totalTokens: usage.total_tokens,
      model: completionModel,
    })

    saveRequest({
      projectId: projectId,
      requestData: prompt,
      responseData: JSON.stringify(resp.data),
      duration: end - start,
      statusCode: resp.status,
      status: resp.statusText,
      model: model,
      parameters: JSON.stringify({
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
        stop,
      }),
      type: 'completion',
      provider: 'openai',
      cost: totalCost,
      hidden: false,
      processed: false,
      spell,
      nodeId,
    })

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return { success: true, choice }
    }
  } catch (err) {
    console.log('ERROR')
    console.error(err)
    return { success: false }
  }
  return { success: false }
}
