import { type SlackEvent, type EventFromType } from '@slack/bolt'
import { type SlackAgentContext } from './state'
import { type EventPayload } from 'server/plugin'

export type SlackEvents = SlackEvent['type']

export type BaseSlackEventPayload = {
  SlackEvents: EventFromType<SlackEvents>
}

export type SlackEventMetadata = Record<string, unknown> & {
  context: SlackAgentContext | null | undefined
}
// export type SlackEvent = EventFromType<SlackEvents>

export type SlackEventPayload = EventPayload<
  BaseSlackEventPayload[keyof BaseSlackEventPayload],
  SlackEventMetadata
>