import { sendEvent, Event } from './meteringClient'
import { CompletionHandlerInputData, getLogger } from '@magickml/core'
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
  if (!OPENMETER_ENABLED) {
    return
  }
  const logger = getLogger()
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
    logger.info('Sending metering event: %o', event)
    await sendEvent(event)
    return true
  } catch (err) {
    logger.error('Error sending metering event: %o', err)
    return false
  }
}

type OpenAIMeterData = {
  projectId: string
  totalTokens: number
  model: string
}

export async function trackOpenAIUsage(data: OpenAIMeterData) {
  return await sendMeteringEvent(data.projectId, data.totalTokens, data.model)
}
