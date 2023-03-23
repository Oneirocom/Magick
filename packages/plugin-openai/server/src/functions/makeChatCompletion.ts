import {
  ChatMessage,
  CompletionHandlerInputData,
  Event,
  saveRequest
} from '@magickml/engine'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'

export async function makeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{success: boolean, result?: string | null, error?: string | null}> {
  const { node, inputs, context } = data
  console.log('context.module.inputs', context.module.inputs)

  // get the values of all keys (which are arrays) in context.module.inputs and filter out undefined
  const inputKeys = Object.values(context.module.inputs).filter((input: any) => {
    return Object.values(input).filter(Boolean).length > 0
  })[0]

  const inputData = (inputKeys as Event[]).filter(Boolean)[0] as Event

  const system = inputs['system']?.[0] as string
  const conversation = inputs['conversation']?.[0] as any

  const settings = ((inputs.settings && inputs.settings[0]) ?? {
    model: node?.data?.model,
    temperature: node?.data?.temperature,
    // max_tokens: node?.data?.max_tokens,
    top_p: node?.data?.top_p,
    frequency_penalty: node?.data?.frequency_penalty,
    presence_penalty: node?.data?.presence_penalty,
    // stop: node?.data?.stop,
  }) as any

  const conversationMessages: ChatMessage[] = []

  conversation?.forEach(event => {
    const message = { role: event.observer === inputData.observer ? 'assistant' : 'user', content: event.content }
    conversationMessages.push(message)
  })


  const input = inputs['input']?.[0] as string

  const systemMessage = { role: 'system', content: system }

  const userMessage = { role: 'user', content: input }

  let messages: ChatMessage[] = []

  if(system)  {
    messages.push(systemMessage)
  }

  messages = [...messages, ...conversationMessages, userMessage]

  settings.messages = messages

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + context.module.secrets['openai_api_key'],
  }

  try {
    const start = Date.now()
    const completion = await axios.post(
      `${OPENAI_ENDPOINT}/chat/completions`,
      settings,
      { headers: headers }
    )

    if(completion.data.error){
      console.error('OpenAI Error', completion.data.error)
    }

    const result = completion.data?.choices[0]?.message?.content

    const usage = completion.data.usage

    saveRequest({
      projectId: context.projectId,
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(completion.data),
      startTime: start,
      statusCode: completion.status,
      status: completion.statusText,
      model: settings.model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'openai',
      totalTokens: usage.total_tokens,
      hidden: false,
      processed: false,
      spell: context.module.spell,
      nodeId: node.id,
    })

    if (
      result &&
      completion.data.choices &&
      completion.data.choices.length > 0
    ) {
      return { success: true, result }
    }
    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
