import {
  ChatMessage,
  CompletionHandlerInputData,
  saveRequest,
} from '@magickml/core'
import { Client, AI_PROMPT, HUMAN_PROMPT } from '@anthropic-ai/sdk'

export async function makeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  const spell = currentSpell
  const conversation = inputs['conversation']?.[0] as any
  const message = inputs['input']?.[0]

  let prompt = HUMAN_PROMPT

  if (conversation) {
    conversation.forEach((line, index) => {
      const role = index % 2 === 0 ? AI_PROMPT : HUMAN_PROMPT
      prompt += line + role
    })
  }

  prompt += message

  const settings = {
    model: 'claude-v1',
    stop_sequences: [HUMAN_PROMPT],
    max_tokens_to_sample: 200,
  }

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const anthropicKey = context.module.secrets['anthropic_api_key']
  const anthropic = new Client(anthropicKey)

  try {
    const start = Date.now()
    const resp = await anthropic.complete({
      prompt,
      ...settings,
    })

    const usage = 0

    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(resp),
      startTime: start,
      statusCode: 0,
      status: 'success',
      model: settings.model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'anthropic',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    if (resp.completion !== '') {
      return { success: true, result: resp.completion }
    }

    return { success: false, error: 'No text returned' }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Unknown error' }
  }
}
