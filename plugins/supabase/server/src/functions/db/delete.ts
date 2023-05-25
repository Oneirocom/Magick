// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import { createClient } from '@supabase/supabase-js'

/**
 * Function to perform a DELETE operation in Supabase.
 *
 * @param {CompletionHandlerInputData} data - Object containing details about the operation.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - Promise resolving to an object indicating whether the operation was successful, and the result or error message.
 */
export async function deleteRow(data: CompletionHandlerInputData): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context
  const spell = currentSpell
  const table = node.data.table as string
  //@ts-ignore
  const condition = (inputs['condition'] as string) || ''
  //@ts-ignore
  const value = (inputs['value'] as string) || ''

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const supabaseUrl = context.module.secrets['supabase_url']
  const supabaseKey = context.module.secrets['supabase_key']

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    let result
    const start = Date.now()

    if (condition && value) {
      result = await supabase.from(table).delete().eq(condition, value).select()
    } else {
      throw new Error('Condition and value are required for a delete operation')
    }

    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify({
        table: table,
        condition: condition,
        value: value,
      }),
      responseData: JSON.stringify(result.data),
      startTime: start,
      statusCode: result.status,
      status: result.statusText,
      model: 'supabase',
      parameters: JSON.stringify({
        table: table,
        condition: condition,
        value: value,
      }),
      type: 'database',
      provider: 'supabase',
      totalTokens: undefined,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    if (result.error) {
      return { success: false, error: result.error.message }
    } else {
      return { success: true, result: result.data }
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
