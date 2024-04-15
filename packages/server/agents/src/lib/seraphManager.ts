import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { getLogger } from 'server/logger'
import { RedisPubSub } from 'server/redis-pubsub'
import { SeraphCore, SeraphOptions } from '@magickml/seraph'
import { ISeraphEvent, SeraphEventTypes, SeraphEvents } from 'servicesShared'
import { AGENT_SERAPH_EVENT } from 'communication'
import { CommandHub } from 'server/command-hub'
import { Application } from 'server/core'

export class SeraphManager extends EventEmitter {
  private seraphCore: SeraphCore
  private agentId: string
  private projectId: string
  private pubSub: RedisPubSub
  private logger: pino.Logger = getLogger()
  private commandHub: CommandHub
  private app: Application

  constructor({
    seraphOptions,
    agentId,
    projectId,
    pubSub,
    commandHub,
    app,
  }: {
    seraphOptions: SeraphOptions
    agentId: string
    projectId: string
    pubSub: RedisPubSub
    commandHub: CommandHub
    app: Application
  }) {
    super()
    this.seraphCore = new SeraphCore(seraphOptions)
    this.agentId = agentId
    this.projectId = projectId
    this.pubSub = pubSub
    this.commandHub = commandHub
    this.app = app

    this.registerCommands()
    this.registerEventListeners()
  }

  registerCommands() {
    this.commandHub.registerDomain('agent', 'seraph', {
      processEvent: async data => {
        this.processEvent(data)
      },
    })
  }

  private registerEventListeners() {
    const eventTypes = Object.values(SeraphEvents).filter(
      event => event !== SeraphEvents.request
    )

    eventTypes.forEach(event => {
      this.seraphCore.on(event, data => {
        const eventData: ISeraphEvent = this.createSeraphEvent(event, {
          [event]: data,
        })

        if (eventData.type === SeraphEvents.message && !eventData.data.message)
          return
        this.publishEvent(eventData)
        this.logSeraphEvent(eventData)
      })
    })
  }

  private createSeraphEvent(
    type: SeraphEvents,
    data: SeraphEventTypes
  ): ISeraphEvent {
    return {
      id: uuidv4(),
      agentId: this.agentId,
      projectId: this.projectId,
      type,
      data,
      createdAt: new Date().toISOString(),
    }
  }

  private publishEvent(eventData: ISeraphEvent): void {
    this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), { data: eventData })
  }

  private async logSeraphEvent(eventData: ISeraphEvent): Promise<void> {
    const isTokenEvent = eventData.type === SeraphEvents.token
    if (isTokenEvent && !eventData?.data.token.includes('<END>')) return // Don't log token events

    try {
      this.logger.debug(
        { eventData },
        `Logging seraph event ${eventData.type} for agent ${this.agentId}`
      )
      await this.app.get('dbClient').insert(eventData).into('seraphEvents')
    } catch (err) {
      this.logger.error('Error logging seraph event', err)
    }
  }
  public async processEvent(eventData: ISeraphEvent): Promise<void> {
    const { data, type, agentId } = eventData
    const { message } = data.request || {}

    this.logger.debug(
      { eventData },
      `Processing event ${type} for agent ${this.agentId}`
    )

    if (message === undefined) {
      this.logger.error('Message is undefined')
      return
    }

    await this.seraphCore.processRequest({
      userInput: message,
      conversationId: agentId,
    })
  }
}
