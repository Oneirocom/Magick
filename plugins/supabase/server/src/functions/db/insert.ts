// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import { createClient } from '@supabase/supabase-js'

/**
 * Function to perform an INSERT operation in Supabase.
 *
 * @param {CompletionHandlerInputData} data - Object containing details about the operation.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - Promise resolving to an object indicating whether the operation was successful, and the result or error message.
 */
export async function insert(data: CompletionHandlerInputData): Promise<{
  success: boolean
  result?: string | null
  error?: string | null
}> {
  // Destructuring relevant information from the data parameter
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context
  const spell = currentSpell
  const table = node.data.table as string
  const dataToInsert = inputs['data'] as Object

  // Error handling for missing secrets
  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  // Destructuring Supabase URL and Key from secrets
  const supabaseUrl = context.module.secrets['supabase_url']
  const supabaseKey = context.module.secrets['supabase_key']

  // Creating a new Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Initializing the result variable
    let result
    const start = Date.now()

    // Performing the insert operation
    result = await supabase.from(table).insert(dataToInsert).select()

    // Saving the request and response data
    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify({
        table: table,
        data: dataToInsert,
      }),
      responseData: JSON.stringify(result.data),
      startTime: start,
      statusCode: result.status,
      status: result.statusText,
      model: 'supabase',
      parameters: JSON.stringify({
        table: table,
        data: dataToInsert,
      }),
      type: 'database',
      provider: 'supabase',
      totalTokens: undefined,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    // Checking if there was an error during the operation
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
