// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import {
  createLanguageModel,
  createJsonTranslator,
  TypeChatLanguageModel,
} from 'typechat'
import { GPT4_MODELS } from '@magickml/plugin-openai-shared'
import {
  DEFAULT_OPENAI_KEY,
  PRODUCTION,
} from 'shared/config'

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeTypeChatCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: object | null
  error?: string | null
  model?: string
  totalTokens?: number
}> {
  const { node, inputs, context } = data
  const input = inputs['input']?.[0] as string
  const schema = inputs['schema']?.[0] as string
  const responseType = inputs['responseType']?.[0] as string
  const modelName = node?.data?.model as string

  const openaiKey = context.module.secrets!['openai_api_key']


  if (PRODUCTION && GPT4_MODELS.includes(modelName) && !openaiKey) {
    return {
      success: false,
      error: 'OpenAI API key is required for GPT-4 models',
    }
  }

  const finalKey = openaiKey ? openaiKey : DEFAULT_OPENAI_KEY

  const modelConfig = {
    OPENAI_API_KEY: finalKey,
    OPENAI_MODEL: modelName,
  }

  const model: TypeChatLanguageModel = createLanguageModel(modelConfig)

  const translator = createJsonTranslator(model, schema, responseType)

  try {
    const start = Date.now()
    // Make the API call to OpenAI
    const response = await translator.translate(input)
    if (!response.success) {
      console.log('response', response)
      throw new Error('TypeChat call failed')
    }

    // // Save the API request details
    saveRequest({
      projectId: context.projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify({
        input,
        model: modelName,
        schema,
        responseType,
      }),
      responseData: JSON.stringify(response.data),
      startTime: start,
      statusCode: response.success ? 200 : 500,
      status: response.success ? 'success' : 'error',
      model: modelName,
      parameters: JSON.stringify({}),
      type: 'completion',
      provider: 'openai',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell: context.currentSpell,
      nodeId: node.id,
    })

    return {
      success: true,
      result: response.data,
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
