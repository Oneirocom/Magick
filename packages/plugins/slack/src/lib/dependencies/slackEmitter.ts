import { EmitterFactory, CreateMessageEvents } from '@magickml/shared-plugins'
import TypedEmitter from 'typed-emitter'
import { SLACK_EVENTS } from '../configx'

export type SlackMessageEvents = CreateMessageEvents<typeof SLACK_EVENTS>

export type SlackEmitterType = TypedEmitter<SlackMessageEvents>

export const SlackEmitter = new EmitterFactory<SlackMessageEvents>(
  SLACK_EVENTS
).getEmitter() as SlackEmitterType
