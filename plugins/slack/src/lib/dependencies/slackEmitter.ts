import { EmitterFactory, CreateMessageEvents } from 'plugins/shared'
import TypedEmitter from 'typed-emitter'
import { SLACK_EVENTS } from '../constants'

export type SlackMessageEvents = CreateMessageEvents<typeof SLACK_EVENTS>

export type SlackEmitterType = TypedEmitter<SlackMessageEvents>

export const SlackEmitter = new EmitterFactory<SlackMessageEvents>(
  SLACK_EVENTS
).getEmitter() as SlackEmitterType
