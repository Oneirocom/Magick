// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import Anthropic from '@anthropic-ai/sdk'
import { countTokens } from '@anthropic-ai/tokenizer'

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function makeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  // get model
  const model = node?.data?.model as string

  // Set the current spell for record keeping.
  const spell = currentSpell

  // Get settings
  const settings = {
    model: node?.data?.model as string,
    max_tokens_to_sample: parseInt(
      (node?.data?.max_tokens_to_sample as string) ?? '300'
    ),
    temperature: parseFloat((node?.data?.temperature as string) ?? '0.7'),
    top_k: parseInt((node?.data?.top_k as string) ?? '5'),
    top_p: parseFloat((node?.data?.top_p as string) ?? '0.7'),
  }

  // Get the input text prompt.
  const prompt = inputs['input'][0] as string

  // Initialize conversationMessages array
  const conversation = inputs['conversation']?.[0] as any
  const conversationMessages: string[] = []

  // Add elements to conversationMessages
  conversation?.forEach(event => {
    const message =
      event.observer === event.sender
        ? `${Anthropic.AI_PROMPT} ${event.content}`
        : `${Anthropic.HUMAN_PROMPT} ${event.content}`

    conversationMessages.push(message)
  })

  // append the new user prompt to the conversation messages
  conversationMessages.push(`${Anthropic.HUMAN_PROMPT} ${prompt}`)

  // combine all messages into one string and append the AI prompt to the end
  const conversationMessagesString =
    '\n\nHuman: ' + conversationMessages.join() + `${Anthropic.AI_PROMPT}`

  // Count the number of tokens in the prompt.
  const tokens = countTokens(conversationMessagesString)

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const anthropicKey = context.module.secrets!['anthropic_api_key']

  const anthropic = new Anthropic({
    apiKey: anthropicKey,
  })

  // Make the API request and handle the response.
  try {
    const start = Date.now()
    const resp = await anthropic.completions.create({
      prompt: conversationMessagesString,
      ...settings,
    })

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(''),
      responseData: JSON.stringify(resp),
      startTime: start,
      statusCode: 200, // TODO: could improve, not returned
      status: 'success', // TODO: could improve, not returned
      model: model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'anthropic',
      totalTokens: tokens,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    return { success: true, result: resp.completion }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
