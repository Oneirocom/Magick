import { Application } from '@feathersjs/feathers'
import { POSTHOG_API_KEY } from 'shared/config'
import { PostHog } from 'posthog-node'

export enum AgentEvents {
  AGENT_DISCORD_MESSAGE = 'agent_discord_message',
  AGENT_DISCORD_RESPONSE = 'agent_discord_response',
}

export interface EventMetadata {
  [key: string]: any
}

export type EventTypes = AgentEvents

// Add support for plugin loading events into this function
export const createPosthogClient = (app: Application) => {
  const client = new PostHog(POSTHOG_API_KEY, {
    host: 'https://app.posthog.com',
  })

  return {
    track: (
      eventName: EventTypes,
      properties: EventMetadata = {},
      agentId: string
    ) => {
      let commonProps = { ...properties }

      if (agentId) {
        commonProps = { ...commonProps, agent_id: agentId, agent: true }
      }

      // could add event properties here too:
      if (Object.values(AgentEvents).includes(eventName as AgentEvents)) {
        const event = {
          distinctId: agentId || 'server',
          event: eventName,
          properties: commonProps,
        }
        app.get('logger').debug('Sending event to PostHog', event)
        client.capture(event)
      }
    },
  }
}
