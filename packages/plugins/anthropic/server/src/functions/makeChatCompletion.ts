// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import Anthropic from '@anthropic-ai/sdk'

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

  // Set the current spell for record keeping.
  const spell = currentSpell

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
    conversationMessages.join() + `${Anthropic.AI_PROMPT}`

  console.log('conversationMessagesString', conversationMessagesString)

  // const requestData = {
  //   model: node?.data?.model,
  //   temperature: parseFloat((node?.data?.temperature as string) ?? '0'),
  //   max_tokens: parseFloat((node?.data?.max_tokens as string) ?? '100'),
  //   top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
  //   frequency_penalty: parseFloat(
  //     (node?.data?.frequency_penalty as string) ?? '0.0'
  //   ),
  //   presence_penalty: parseFloat(
  //     (node?.data?.presence_penalty as string) ?? '0.0'
  //   ),
  //   stop: node?.data?.stop,
  // }

  // Get the settings object, setting default values if necessary.
  // const settings = requestData as any

  // Add the prompt to the settings object.
  // settings.prompt = prompt

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
      // prompt: `${Anthropic.HUMAN_PROMPT} hello world ${Anthropic.AI_PROMPT} `,
      prompt: conversationMessagesString,
      // stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: 200,
      model: 'claude-v1',
    })

    const usage = 0

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(''),
      responseData: JSON.stringify(resp),
      startTime: start,
      statusCode: 0, // TODO:
      status: 'success', // TODO
      model: 'claude-v1', // TODO
      parameters: JSON.stringify(''),
      type: 'completion',
      provider: 'anthropic', // TODO
      totalTokens: 0, // TODO
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
