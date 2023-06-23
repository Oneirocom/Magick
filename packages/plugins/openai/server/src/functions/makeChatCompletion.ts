// DOCUMENTED
import {
  ChatMessage,
  CompletionHandlerInputData,
  saveRequest,
} from '@magickml/core'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  const { node, inputs, context } = data

  // Get the system message and conversation inputs
  const system = inputs['system']?.[0] as string
  const conversation = inputs['conversation']?.[0] as any
  let func = inputs['function']?.[0] as string

  // Get or set default settings
  const settings = {
    model: node?.data?.model,
    temperature: parseFloat((node?.data?.temperature as string) ?? '0.0'),
    top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
    frequency_penalty: parseFloat(
      (node?.data?.frequency_penalty as string) ?? '0.0'
    ),
    presence_penalty: parseFloat(
      (node?.data?.presence_penalty as string) ?? '0.0'
    ),
  } as any

  // Initialize conversationMessages array
  const conversationMessages: ChatMessage[] = []

  // Add elements to conversationMessages
  conversation?.forEach(event => {
    const message = {
      role: event.observer === event.sender ? 'assistant' : 'user',
      content: event.content,
    }
    conversationMessages.push(message)
  })

  // Get the user input
  const input = inputs['input']?.[0] as string

  // Create the system and user messages
  const systemMessage = { role: 'system', content: system }
  const userMessage = { role: 'user', content: input }

  // Initialize messages array and add elements
  let messages: ChatMessage[] = []

  messages = [...messages, ...conversationMessages]

  if (system) {
    messages.push(systemMessage)
  }

  messages.push(userMessage)

  // Update the settings messages
  settings.messages = messages
  if (func && func !== '') {
    // if func is a string, it's propbably an unescaped string of json
    // first, check if it's json
    if (func[0] === '{' && func[func.length - 1] === '}') {
      try {
        // then parse the json
        func = JSON.parse(func)
        console.log('parsed function', func)
      } catch (e) {
        console.error('Error parsing function', e)
      }
    }
    settings.functions = [func]
  }

  // Create request headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + context.module.secrets!['openai_api_key'],
  }

  console.log('settings.functions', settings)

  try {
    const start = Date.now()
    // Make the API call to OpenAI
    const completion = await axios.post(
      `${OPENAI_ENDPOINT}/chat/completions`,
      settings,
      { headers: headers }
    )

    if (completion.data.error) {
      console.error('OpenAI Error', completion.data.error)
    }

    const finishReason = completion.data?.choices[0]?.finish_reason
    const function_call =
      completion.data?.choices[0]?.message?.function_call?.arguments

    console.log('completion.data', completion.data)
    console.log('function_call', function_call)

    // Extract the result from the response
    const result =
      finishReason === 'function_call'
        ? function_call
        : completion.data?.choices[0]?.message?.content

    // Log the usage of tokens
    const usage = completion.data.usage

    // Save the API request details
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
      spell: context.currentSpell,
      nodeId: node.id,
    })

    if (function_call) {
      return { success: true, result: function_call }
    }

    if (result) {
      return { success: true, result }
    }
    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
