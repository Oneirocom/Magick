// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import { GOOGLEAI_ENDPOINT } from '../constants'
import { trackGoogleAIUsage } from 'server/core'
import { wordCount } from './shared'
import { DEFAULT_GOOGLEAI_API_KEY } from 'shared/config'

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function makeTextCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data

  // Get the input text prompt.
  const prompt = { text: inputs['input'][0] }

  // node?.data?.stopSequences is a comma separated text, convert to an array
  const stopSequences =
    node?.data?.stopSequences !== '' &&
    (node?.data?.stopSequences as string)
      .split(',')
      .map((sequence: string) => sequence.trim())

  const settings = {
    model: node?.data?.model,
    temperature: parseFloat((node?.data?.temperature as string) ?? '0.0'),
    top_p: parseFloat((node?.data?.top_p as string) ?? '0.95'),
    top_k: parseFloat((node?.data?.top_k as string) ?? '40'),
    prompt: prompt,
    candidateCount: 1,
  }

  if (stopSequences) {
    settings['stopSequences'] = stopSequences
  }

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  // Make the API request and handle the response.
  const start = Date.now()

  const apiKey =
    (context?.module?.secrets &&
      context?.module?.secrets['googleai_api_key']) ||
    DEFAULT_GOOGLEAI_API_KEY ||
    null

  if (!apiKey) {
    return {
      success: false,
      error: 'GoogleAI API key is required to make a text completion',
    }
  }

  try {
    const endpoint = `${GOOGLEAI_ENDPOINT}/${node?.data?.model}:generateText?key=${apiKey}`
    // Make the API call to GoogleAI
    const completion = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    const completionData = await completion.json()

    if (completionData.error) {
      console.error('GoogleAI Error', completionData.error)
    }

    // Extract the result from the response
    const result = completionData.candidates?.[0]?.output

    saveRequest({
      projectId: context.projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(completionData),
      startTime: start,
      statusCode: completion.status,
      status: completion.statusText,
      model: node?.data?.model as string,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'googleai',
      totalTokens: 0, // usage.total_tokens,
      hidden: false,
      processed: false,
      spell: context.currentSpell,
      nodeId: node.id,
    })

    // Save metering event
    trackGoogleAIUsage({
      projectId: context.projectId,
      model: node?.data?.model as string,
      callCount: 1,
      wordCount: wordCount(result),
    })

    if (result) {
      return { success: true, result }
    }

    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
