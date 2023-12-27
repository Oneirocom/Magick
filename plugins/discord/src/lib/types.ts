export type DiscordEventType =
  | 'MESSAGE_CREATE'
  | 'MESSAGE_UPDATE'
  | 'MESSAGE_DELETE'
  | 'MESSAGE_REACTION_ADD'
  | 'MESSAGE_REACTION_REMOVE'

export type DiscordMessageEvent = {
  id: string
  type: DiscordEventType
  channel: string
  user?: string
  content: string
  timestamp: string
}

export type DiscordEventPayload = {
  token: string
  event: DiscordMessageEvent
  type: 'event_callback'
  event_id: string
  event_time: number
}

export type DiscordCredentials = {
  token: string | undefined
}
