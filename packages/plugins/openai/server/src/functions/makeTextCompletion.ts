// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'
import { OPENAI_ENDPOINT } from '../constants'
import {
  DEFAULT_OPENAI_KEY,
  PRODUCTION,
  BACKOFF_RETRY_LIMIT,
} from 'shared/config'
import { GPT4_MODELS } from '@magickml/plugin-openai-shared'
import { trackOpenAIUsage } from '@magickml/server-core'
import axiosRetry from 'axios-retry'

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
  model?: string
  totalTokens?: number
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  // Set the current spell for record keeping.
  const spell = currentSpell

  // Get the input text prompt.
  const prompt = inputs['input'][0]

  const requestData = {
    model: node?.data?.customModel ?? node?.data?.model,
    temperature: parseFloat((node?.data?.temperature as string) ?? '0'),
    max_tokens: parseFloat((node?.data?.max_tokens as string) ?? '100'),
    top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
    frequency_penalty: parseFloat(
      (node?.data?.frequency_penalty as string) ?? '0.0'
    ),
    presence_penalty: parseFloat(
      (node?.data?.presence_penalty as string) ?? '0.0'
    ),
    stop: node?.data?.stop,
  }

  // Get the settings object, setting default values if necessary.
  const settings = requestData as any

  // Add the prompt to the settings object.
  settings.prompt = prompt

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const openaiKey = context.module.secrets!['openai_api_key']

  if (PRODUCTION && GPT4_MODELS.includes(settings.model) && !openaiKey) {
    return {
      success: false,
      error: 'OpenAI API key is required for GPT-4 models',
    }
  }

  // Set up headers for the API request.
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + (openaiKey ? openaiKey : DEFAULT_OPENAI_KEY),
  }

  // Make the API request and handle the response.
  try {
    // Exponential back-off retry delay between requests
    axiosRetry(axios, {
      retries: BACKOFF_RETRY_LIMIT,
      retryDelay: axiosRetry.exponentialDelay,
      shouldResetTimeout: true,
      retryCondition: error => {
        return error?.response?.status === 429
      },
    })

    const start = Date.now()
    const resp = await axios.post(`${OPENAI_ENDPOINT}/completions`, settings, {
      headers: headers,
    })

    const usage = resp.data.usage

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(resp.data),
      startTime: start,
      statusCode: resp.status,
      status: resp.statusText,
      model: node?.data?.model as string,
      customModel: (node?.data?.customModel as string) || undefined,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'openai',
      totalTokens: usage.total_tokens,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    // Save to metering server
    trackOpenAIUsage({
      projectId,
      model: settings.model,
      totalTokens: usage.total_tokens,
    })

    // Check if choices array is not empty, then return the result.
    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return {
        success: true,
        result: choice.text,
        model: settings.model,
        totalTokens: usage.total_tokens,
      }
    }
    // If no choices were returned, return an error.
    return { success: false, error: 'No choices returned' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
