import { EventPayload } from '@magickml/shared-services'

export interface IDatabaseService {
  // Graph event methods
  saveGraphEvent(graphEvent: GraphEvent): Promise<void>

  // Event querying
  queryEvents(args: {
    agentId: string
    eventPropertyKeys: EventProperties[]
    messageTypes: string[]
    limit?: number
  }): Promise<any>

  // Message deletion
  deleteMessages(agentId: string, eventIds: string[]): Promise<void>

  // Any other database-specific operations you want to abstract
}

export type GraphEvent = {
  sender: string
  observer: string
  agentId: string
  connector: string
  connectorData: string
  content: string
  eventType: string
  event: EventPayload
}

export type EventProperties =
  | 'sender'
  | 'agentId'
  | 'connector'
  | 'channel'
  | 'from user'
  | 'to user'
