import { sendEvent, Event } from './meteringClient'
import { CompletionHandlerInputData } from '@magickml/core'
import { v4 as uuidv4 } from 'uuid'
import { OPENMETER_ENABLED } from '@magickml/config'

/**
 * Sends a metering event to the OpenMeter server.
 *
 * @param {string} projectId - The id of the project.
 * @param {number} totalTokens - The total number of tokens.
 * @param {string} model - The model used for the completion.
 */
async function sendMeteringEvent(
  projectId: string,
  totalTokens: number,
  model: string
) {
  console.log('Sending metering data to OpenMeter server')
  const event: Event = {
    specversion: '1.0',
    id: uuidv4(),
    source: 'magick-cloud',
    type: model,
    subject: projectId,
    time: new Date().toISOString(),
    data: {
      total_tokens: totalTokens.toString(),
      model,
      project_id: projectId,
    },
  }

  try {
    await sendEvent(event)
    console.log('Successfully sent metering data')
  } catch (err) {
    console.error('Failed to send metering data: ', err)
  }
}

/**
 * Tracks the usage of the OpenAI API by sending a metering event.
 *
 * @param {Function} handler - The handler function.
 * @returns {Function} - The decorated handler function.
 */
export function trackUsage(handler: Function) {
  return async function (data: CompletionHandlerInputData) {
    // Run the original handler
    const result = await handler(data)

    // If the result is successful, send total tokens to metering endpoint
    if (OPENMETER_ENABLED && result.success) {
      sendMeteringEvent(
        data.context.projectId,
        result.totalTokens,
        result.model
      )
    }

    return result
  }
}
