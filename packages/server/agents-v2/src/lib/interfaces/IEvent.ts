export type EventFormat<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  plugin?: string
  content: string
  sender: string
  channel: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  client: string
  isPlaytest?: boolean
  spellId?: string
  data: Data
  metadata?: Y
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

export type EventPayload<T = any, Y = any> = {
  connector: string
  eventName: string
  status: 'success' | 'error' | 'pending' | 'unknown'
  content: string
  sender: string
  observer: string
  client: string
  channel: string
  plugin: string
  agentId: string
  isPlaytest?: boolean
  spellId?: string
  skipSave?: boolean
  // entities: any[]
  channelType: string
  skipPersist?: boolean
  rawData: string
  timestamp: string
  stateKey?: string
  runInfo?: {
    spellId: string
  }
  data: T
  metadata: Y
}

export interface ActionPayload<T = unknown, Y = unknown> {
  actionName: string
  event: EventPayload<T, Y>
  skipSave?: boolean
  data: any
}
