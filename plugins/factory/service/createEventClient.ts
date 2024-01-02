import pino from 'pino'
import { getLogger } from 'packages/server/logger/src'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { EventPayload } from 'packages/server/plugin/src'
import { ActionPayload } from 'packages/server/plugin/src'

import { createEmitter } from 'plugins/factory'
import TypedEventEmitter from 'typed-emitter'

export const ON_OPENAI = 'openAiCompletion'

type OpenAiEvents = {
  error: (error: Error) => void
  [ON_OPENAI]: (event: EventPayload) => void
}

export type OpenAiEmitterType = TypedEventEmitter<OpenAiEvents>

export const OpenAiEmitter = createEmitter<OpenAiEvents>()

export class EventClient {
  private logger: pino.Logger = getLogger()
  private pubSub: RedisPubSub
  private agentId: string
  private eventHandlers: Map<string, ((message: EventPayload) => void)[]>

  constructor(pubSub: RedisPubSub, agentId: string) {
    this.pubSub = pubSub
    this.agentId = agentId
    this.eventHandlers = new Map()
    this.subscribeToCoreEvents()
  }

  private subscribeToCoreEvents(): void {
    const pattern = `agent:${this.agentId}:Request:*`
    this.logger.debug(`Subscribing to pattern '${pattern}'`)
    this.pubSub.patternSubscribe(pattern, this.coreEventHandler.bind(this))
  }

  private coreEventHandler(event, channel) {
    const eventType = this.extractEventType(channel)
    this.logger.debug(`Received event of type '${eventType}'`)
    this.eventHandlers.get(eventType)?.forEach(handler => handler(event))
  }

  private extractEventType(channel: string): string {
    return channel.split(':')[3]
  }

  registerHandler(
    eventType: string,
    handler: (message: EventPayload) => void
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(handler)
  }

  sendMessage(payload: ActionPayload): void {
    this.logger.debug('Sending message from client', payload)
    this.pubSub.publish(`agent:${this.agentId}:Event:event`, payload)
  }

  cleanup(): void {
    const pattern = `agent:${this.agentId}:Request:*`
    this.pubSub.removePatternCallback(pattern, this.coreEventHandler.bind(this))
    this.eventHandlers.clear()
  }
}

class EventClientFactory {
  static createEventClient(pubSub: RedisPubSub, agentId: string): EventClient {
    return new EventClient(pubSub, agentId)
  }
}

export default EventClientFactory
