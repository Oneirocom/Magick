// DOCUMENTED
import {
  ChatMessage,
  CompletionHandlerInputData,
  saveRequest,
} from '@magickml/core'
import axios from 'axios'
import Replicate from 'replicate'

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeJsonformerCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  const { node, inputs, context } = data
  const cogKey = context.module.secrets!['cog_api_key']

  const replicate = new Replicate({
    auth: cogKey,
  })

  const schema = inputs['schema']?.[0] as any
  const schemaString = JSON.stringify(schema)
  const prompt = inputs['prompt']?.[0] as string

  // Get or set default settings
  // const settings = {
  //   model: node?.data?.model,
  //   temperature: parseFloat((node?.data?.temperature as string) ?? '0.0'),
  //   top_p: parseFloat((node?.data?.top_p as string) ?? '1.0'),
  //   frequency_penalty: parseFloat(
  //     (node?.data?.frequency_penalty as string) ?? '0.0'
  //   ),
  //   presence_penalty: parseFloat(
  //     (node?.data?.presence_penalty as string) ?? '0.0'
  //   ),
  // } as any

  // Initialize conversationMessages array
  const conversationMessages: ChatMessage[] = []

  // Get the user input
  const input = inputs['input']?.[0] as string

  try {
    const start = Date.now()

    const output = await replicate.run(
      'coffeeorgreentea/jsonformer:9f68cf07185e93bcee87e97f24bd50ec90c2acfb73779486b3e3ebf34e6bf6da',
      {
        input: {
          prompt: prompt,
          json_schema: schemaString,
        },
      }
    )

    // Make the API call to cog

    // Save the API request details
    // saveRequest({
    //   projectId: context.projectId,
    //   requestData: JSON.stringify(settings),
    //   responseData: JSON.stringify(completion.data),
    //   startTime: start,
    //   statusCode: completion.status,
    //   status: completion.statusText,
    //   model: settings.model,
    //   parameters: JSON.stringify(settings),
    //   type: 'completion',
    //   provider: 'cog',
    //   totalTokens: usage.total_tokens,
    //   hidden: false,
    //   processed: false,
    //   spell: context.currentSpell,
    //   nodeId: node.id,
    // })

    if (output) {
      return { success: true, result: JSON.stringify(output) }
    }
    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
