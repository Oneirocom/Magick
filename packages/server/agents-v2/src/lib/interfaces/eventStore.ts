import { ActionPayload, EventPayload } from '@magickml/shared-services'
import { EventProperties } from './database'
import { GraphNodes } from '@magickml/behave-graph'

export enum StatusEnum {
  INIT = 'INIT',
  READY = 'READY',
  AWAIT = 'AWAIT',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERRORED = 'ERRORED',
}

export type Message = {
  role: string
  content: string | { type: string; text: string }[]
}

export type EventWithKey = EventPayload & { stateKey: string }

export type EventStoreEvents = {
  done: (event: EventPayload | null) => void
}

export interface IEventStore {
  currentEvent: () => EventPayload | null
  initialEvent: () => EventPayload | null
  queryEvents: (
    eventPropertyKeys: EventProperties[],
    messageTypes: string[],
    limit?: number
  ) => any
  saveAgentMessage: (content: string) => Promise<void>
  saveUserMessage: (content: string) => Promise<void>
  addMessage: (content: string, role: 'user' | 'assistant') => Promise<void>
  saveUserEvent: (data: ActionPayload) => Promise<void>
  saveAgentEvent: (data: ActionPayload) => Promise<void>
  deleteMessages: (eventPropertyKeys: EventProperties[]) => Promise<void>
  getMessages: (
    eventPropertyKeys: EventProperties[],
    limit?: number,
    alternateRoles?: boolean
  ) => Promise<Message[]>
  getKey: () => string | null
  setEvent: (event: EventWithKey) => void
  setInitialEvent: (event: EventPayload) => void
  init: (nodes: GraphNodes) => void
  finish: () => void
  done: () => void
  await: () => void
  getStatus: () => StatusEnum
}
