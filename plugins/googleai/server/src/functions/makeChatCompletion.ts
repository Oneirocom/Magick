// DOCUMENTED 
import {
  CompletionHandlerInputData,
  Event,
  saveRequest
} from '@magickml/core'
import axios from 'axios'
import { GOOGLEAI_ENDPOINT } from '../constants'

type ChatMessage = {
  author?: string
  content: string
}

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{ success: boolean, result?: string | null, error?: string | null }> {
  const { node, inputs, context } = data

  // Get the system message and conversation inputs
  const system = inputs['system']?.[0] as ChatMessage
  const conversation = inputs['conversation']?.[0] as any

  // Initialize conversationMessages array
  const conversationMessages: ChatMessage[] = []

  // Add elements to conversationMessages
  conversation?.forEach(event => {
    conversationMessages.push({ content: event.content })
  })

  // Get the user input
  const input = inputs['input']?.[0] as string

  conversationMessages.push({ content: input })

  const examples = inputs['examples']?.[0] as string[] || []

  // Get or set default settings
  const settings = {
    prompt: {
      context: system || null,
      messages: [...conversationMessages, input],
      examples: examples || [],
    },
    candidate_count: 1,
    temperature: parseFloat(node?.data?.temperature as string ?? "0.0"),
    top_p: parseFloat(node?.data?.top_p as string ?? "0.95"),
    top_k: parseFloat(node?.data?.top_k as string ?? "40")
  } as any

  console.log('settings')
  console.log(settings)

  // Create request headers
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    const start = Date.now()
    // Make the API call to GoogleAI
    const completion = await axios.post(
      `${GOOGLEAI_ENDPOINT}/${node?.data?.model}:generateMessage?key=${context.module.secrets['googleai_api_key']}}`,
      settings,
      { headers: headers }
    )

    if (completion.data.error) {
      console.error('GoogleAI Error', completion.data.error)
    }

    // Extract the result from the response
    const result = completion.data?.choices[0]?.message?.content

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
      provider: 'googleai',
      totalTokens: usage.total_tokens,
      hidden: false,
      processed: false,
      spell: context.currentSpell,
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