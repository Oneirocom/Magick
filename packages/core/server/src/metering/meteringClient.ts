import axios from 'axios'
import { OPENMETER_ENDPOINT, OPENMETER_ENABLED } from '@magickml/config'
import { getLogger } from '@magickml/core'
import { v4 as uuidv4 } from 'uuid'

/**
 * Represents the event data.
 */
type MeteringEventData = {
  total_tokens?: string
  duration_ms?: string
  model: string
  project_id: string
}

/**
 * Represents the event.
 */
type MeteringEvent = {
  specversion: string
  type: string
  id: string
  time: string
  source: string
  subject: string
  data: MeteringEventData
}

/**
 * Sends a metering event to the OpenMeter server.
 *
 * @param {string} projectId - The id of the project.
 * @param {number} totalTokens - The total number of tokens, optional.
 * @param {number} durationMs - The duration in milliseconds, optional.
 * @param {string} model - The model used for the completion.
 * @return {Promise<boolean>} Indicates whether the event was sent successfully.
 */
async function sendMeteringEvent(
  projectId: string,
  model: string,
  totalTokens?: number,
  durationMs?: number
): Promise<boolean> {
  if (!OPENMETER_ENABLED) {
    return Promise.resolve(false)
  }
  const logger = getLogger()

  const event: MeteringEvent = {
    specversion: '1.0',
    id: uuidv4(),
    source: 'magick-cloud',
    type: model,
    subject: projectId,
    time: new Date().toISOString(),
    data: {
      total_tokens: totalTokens?.toString(),
      duration_ms: durationMs?.toString(),
      model,
      project_id: projectId,
    },
  }

  const headers = {
    Expect: '',
    'Content-Type': 'application/cloudevents+json',
  }

  try {
    logger.info('Sending metering event: %o', event)
    const response = await axios.post(
      `${OPENMETER_ENDPOINT}/api/v1alpha1/events`,
      event,
      { headers }
    )
    return response.status === 200
  } catch (err) {
    logger.error('Error sending metering event: %o', err)
    return false
  }
}

export { sendMeteringEvent, MeteringEvent, MeteringEventData }
