import { type SlackEvent, type EventFromType } from '@slack/bolt'
import { type SlackAgentContext } from './state'
import { type EventPayload } from 'server/plugin'

export type SlackEvents = SlackEvent['type']

// slack 'message' event has subtypes that are there own kind of thing to parse
// we omit undefined here, but subtype was then the message is a base message event
export type SlackMessageSubtypes = Exclude<
  EventFromType<'message'>['subtype'],
  undefined
>

// this is the event when the subtype is undefined
export type SlackBaseMessageEvent = EventFromType<'message'> & {
  subtype: undefined
}

// this is all message with a subtype
export type SlackMessageEvents = {
  [key in SlackMessageSubtypes]: EventFromType<'message'>
}

export type BaseSlackEventPayload = {
  SlackEvents: EventFromType<SlackEvents>
}

export type SlackEventMetadata = Record<string, unknown> & {
  context: SlackAgentContext | null | undefined
}

export type SlackEventPayload = EventPayload<
  BaseSlackEventPayload[keyof BaseSlackEventPayload],
  SlackEventMetadata
>

export type SendSlackMessage = (
  content: string,
  channel: string
) => Promise<void>
