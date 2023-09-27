// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from 'shared/core'
import { knex } from 'knex'

/**
 * Function to perform an SELECT operation in PostgreSQL with Knex.js.
 *
 * @param {CompletionHandlerInputData} data - Object containing details about the operation.
 * @returns {Promise<{success: boolean, result?: any | null, error?: string | null}>} - Promise resolving to an object indicating whether the operation was successful, and the result or error message.
 */
export async function select(data: CompletionHandlerInputData): Promise<{
  success: boolean
  result?: any | null
  error?: string | null
}> {
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context
  const spell = currentSpell
  const table = node.data.table as string
  const columns = inputs['columns'][0] as string[]

  const condition =
    inputs['condition'] && inputs['condition'][0]
      ? (inputs['condition'][0] as string)
      : undefined
  const value =
    inputs['value'] && inputs['value'][0]
      ? (inputs['value'][0] as string)
      : undefined

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const pgString = context.module.secrets['pg_string']

  const pg = knex({
    client: 'pg',
    connection: pgString,
  })

  try {
    let result
    const start = Date.now()

    if (condition && value) {
      result = await pg(table)
        .select(...columns)
        .where(condition, '=', value)
    } else {
      result = await pg(table).select(...columns)
    }

    saveRequest({
      projectId: projectId,
      agentId: context.agent?.id || 'preview',
      requestData: JSON.stringify({
        table: table,
        columns: columns,
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
        columns: columns,
        conditions: condition,
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
