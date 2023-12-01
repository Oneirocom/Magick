// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import { knex } from 'knex'

/**
 * Function to perform an UPDATE operation in PostgreSQL with Knex.js.
 *
 * @param {CompletionHandlerInputData} data - Object containing details about the operation.
 * @returns {Promise<{success: boolean, result?: any | null, error?: string | null}>} - Promise resolving to an object indicating whether the operation was successful, and the result or error message.
 */
export async function update(data: CompletionHandlerInputData): Promise<{
  success: boolean
  result?: any | null
  error?: string | null
}> {
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context
  const spell = currentSpell
  const table = node.data.table as string
  const condition = inputs['condition'][0] as string
  const value = inputs['value'][0] as string
  const updates = inputs['data'][0] as Object

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const pgString = context.module.secrets['pg_string']

  const pg = knex({
    client: 'pg',
    connection: pgString,
  })

  try {
    const start = Date.now()

    const result = await pg(table)
      .where(condition, '=', value)
      .update(updates)
      .returning('*')

    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify({
        table: table,
        updates: updates,
        condition: condition,
        value: value,
      }),
      responseData: JSON.stringify(result),
      startTime: start,
      statusCode: result ? 200 : 500,
      status: result ? 'OK' : 'Error',
      model: 'knex',
      parameters: JSON.stringify({
        table: table,
        updates: updates,
        condition: condition,
        value: value,
      }),
      type: 'database',
      provider: 'postgres',
      totalTokens: undefined,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    if (result instanceof Error) {
      return { success: false, error: result.message }
    } else {
      return { success: true, result: result }
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  } finally {
    await pg.destroy()
  }
}
