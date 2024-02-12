import axios from 'axios'
import { OPENMETER } from 'shared/config'
import { getLogger } from 'server/logger'
import { v4 as uuidv4 } from 'uuid'

/**
 * Represents the event data.
 */
type MeteringEventData = {
  project_id: string
  model: string
  type: string
  total_tokens?: number
  duration_ms?: number
  call_count?: number
  word_count?: number
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
  data: any
}

/**
 * Sends a metering event to the OpenMeter server.
 *
 * @param {string} projectId - The id of the project.
 * @param {string} model - The model used for the completion.
 * @param {string} type - The type of the event.
 * @param {number} totalTokens - The total number of tokens, optional.
 * @param {number} durationMs - The duration in milliseconds, optional.
 * @param {number} callCount - The number of completions, optional.
 * @return {Promise<boolean>} Indicates whether the event was sent successfully.
 */
async function sendMeteringEvent(data: MeteringEventData): Promise<boolean> {
  if (!OPENMETER.enabled) {
    return Promise.resolve(false)
  }
  const logger = getLogger()

  const event: MeteringEvent = {
    specversion: '1.0',
    id: uuidv4(),
    source: OPENMETER.source,
    type: data.type,
    subject: data.project_id,
    time: new Date().toISOString(),
    data: {
      project_id: data.project_id,
      model: data.model,
      total_tokens: data.total_tokens,
      execution_time: data.duration_ms,
      call_count: data.call_count,
    },
  }

  const headers = {
    Expect: '',
    'Content-Type': 'application/cloudevents+json',
    Authorization: `Bearer ${OPENMETER.token}`,
  }

  try {
    const response = await axios.post(OPENMETER.endpoint, event, { headers })
    return response.status === 200
  } catch (err) {
    logger.error('Error sending metering event: %o', err)
    return false
  }
}

export { sendMeteringEvent, type MeteringEvent, type MeteringEventData }
