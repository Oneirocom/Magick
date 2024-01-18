import pino from 'pino'
import { getLogger } from 'packages/server/logger/src'
import { EventPayload } from 'packages/server/plugin/src'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { DISCORD_EVENTS } from '../constants'

class DiscordEventClient {
  private logger: pino.Logger = getLogger()
  private pubSub: RedisPubSub
  private agentId: string
  private eventHandlers: Map<string, ((message: EventPayload) => void)[]>

  constructor(pubSub: RedisPubSub, agentId: string) {
    this.pubSub = pubSub
    this.agentId = agentId
    this.eventHandlers = new Map()
    this.subscribeToDiscordEvents()
  }

  private subscribeToDiscordEvents(): void {
    const pattern = `agent:${this.agentId}:Discord:*`
    this.logger.debug(`Subscribing to pattern '${pattern}'`)
    this.pubSub.patternSubscribe(pattern, this.discordEventHandler.bind(this))
  }

  discordEventHandler(event, channel) {
    const eventType = this.extractEventType(channel)

    this.logger.debug(`Received event of type '${eventType}'`)
    event.plugin = 'discord'

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

  onMessage(handler: (event: EventPayload) => void): void {
    this.logger.debug('Registering handler for discord onMessage event')
    this.registerHandler(DISCORD_EVENTS.messageCreate, handler)
  }

  sendMessage(payload: any): void {
    console.log('Sending message from discord client!!!', payload)
    this.pubSub.publish(`agent:${this.agentId}:Discord:event`, payload)
  }

  cleanup(): void {
    const pattern = `agent:${this.agentId}:Discord:*`
    this.pubSub.removePatternCallback(
      pattern,
      this.discordEventHandler.bind(this)
    )
    this.eventHandlers.clear()
  }
}

export default DiscordEventClient
