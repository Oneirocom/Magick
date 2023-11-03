export enum AgentEvents {
  AGENT_DISCORD_MESSAGE = 'agent_discord_message',
  AGENT_DISCORD_RESPONSE = 'agent_discord_response',
}

export interface EventMetadata {
  [key: string]: any
}

export type EventTypes = AgentEvents

// Add support for plugin loading events into this function
export const buildEventTracker = posthog => {
  return {
    track: (
      eventName: EventTypes,
      metadata: EventMetadata = {},
      agentId?: string
    ) => {
      let commonProps = { ...metadata }

      if (agentId) {
        commonProps = { ...commonProps, agent_id: agentId }
      }

      if (Object.values(AgentEvents).includes(eventName as AgentEvents)) {
        posthog.capture(eventName, commonProps)
      }
    },
  }
}
