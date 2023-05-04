// DOCUMENTED 
import {
  CompletionHandlerInputData,
  saveRequest
} from '@magickml/core'
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
      messages: [...conversationMessages],
      examples: examples || [],
    },
    candidate_count: 1,
    temperature: parseFloat(node?.data?.temperature as string ?? "0.0"),
    top_p: parseFloat(node?.data?.top_p as string ?? "0.95"),
    top_k: parseFloat(node?.data?.top_k as string ?? "40")
  } as any

  try {
    const start = Date.now()
    const endpoint = `${GOOGLEAI_ENDPOINT}/${node?.data?.model}:generateMessage?key=${context.module.secrets['googleai_api_key']}`
    // Make the API call to GoogleAI
    const completion = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      }
    )

    const completionData = await completion.json()

    if (completionData.error) {
      console.error('GoogleAI Error', completionData.error)
    }

    console.log('completionData', completionData)

    // Extract the result from the response
    const result = completionData.candidates[0].content

    // Log the usage of tokens
    // const usage = completionData.usage

    // Save the API request details
    saveRequest({
      projectId: context.projectId,
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(completionData),
      startTime: start,
      statusCode: completion.status,
      status: completion.statusText,
      model: settings.model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'googleai',
      totalTokens: 0, // usage.total_tokens,
      hidden: false,
      processed: false,
      spell: context.currentSpell,
      nodeId: node.id,
    })

    if(result) {
      return { success: true, result }
    }

    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}