import axios from 'axios'
import { OPENMETER_ENDPOINT } from '@magickml/config'

/**
 * Represents the event data.
 */
type Data = {
  total_tokens?: string
  duration_ms?: string
  model: string
  project_id: string
}

/**
 * Represents the event.
 */
export type Event = {
  specversion: string
  type: string
  id: string
  time: string
  source: string
  subject: string
  data: Data
}

/**
 * Sends an event to the specified endpoint.
 * @param {Event} event - The event to be sent.
 * @return {Promise<number>} The HTTP status code.
 */
export async function sendEvent(event: Event): Promise<number> {
  const headers = {
    Expect: '',
    'Content-Type': 'application/cloudevents+json',
  }

  try {
    const response = await axios.post(
      `${OPENMETER_ENDPOINT}/api/v1alpha1/events`,
      event,
      { headers }
    )
    return response.status
  } catch (error) {
    throw error
  }
}
