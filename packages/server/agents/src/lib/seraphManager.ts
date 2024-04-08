import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { getLogger } from 'server/logger'
import { RedisPubSub } from 'server/redis-pubsub'
import { SeraphCore, SeraphOptions } from '@magickml/seraph'
import { ISeraphEvent, SeraphEventTypes, SeraphEvents } from 'servicesShared'
import { AGENT_SERAPH_EVENT } from 'communication'

export class SeraphManager extends EventEmitter {
  private seraphCore: SeraphCore
  private agentId: string
  private projectId: string
  pubSub: RedisPubSub
  logger: pino.Logger = getLogger()

  constructor({
    seraphOptions,
    agentId,
    projectId,
    pubSub,
  }: {
    seraphOptions: SeraphOptions
    agentId: string
    projectId: string
    pubSub: any
  }) {
    super()
    this.seraphCore = new SeraphCore(seraphOptions)
    this.agentId = agentId
    this.projectId = projectId
    this.pubSub = pubSub

    this.registerEventListeners()
  }

  private registerEventListeners() {
    this.seraphCore.on('error', (data: SeraphEventTypes['error']) => {
      const event: ISeraphEvent = this.createSeraphEvent(SeraphEvents.error, {
        error: data,
      })
      this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
    })

    this.seraphCore.on('message', (data: SeraphEventTypes['message']) => {
      const event: ISeraphEvent = this.createSeraphEvent(SeraphEvents.message, {
        message: data,
      })
      this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
    })

    this.seraphCore.on('info', (data: SeraphEventTypes['info']) => {
      const event: ISeraphEvent = this.createSeraphEvent(SeraphEvents.info, {
        info: data,
      })
      this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
    })

    this.seraphCore.on('token', (data: SeraphEventTypes['token']) => {
      const event: ISeraphEvent = this.createSeraphEvent(SeraphEvents.token, {
        token: data,
      })
      this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
    })

    this.seraphCore.on(
      'functionExecution',
      (data: SeraphEventTypes['functionExecution']) => {
        const event: ISeraphEvent = this.createSeraphEvent(
          SeraphEvents.functionExecution,
          { functionExecution: data }
        )
        this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
      }
    )

    this.seraphCore.on(
      'functionResult',
      (data: SeraphEventTypes['functionResult']) => {
        const event: ISeraphEvent = this.createSeraphEvent(
          SeraphEvents.functionResult,
          { functionResult: data }
        )
        this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
      }
    )

    this.seraphCore.on(
      'middlewareExecution',
      (data: SeraphEventTypes['middlewareExecution']) => {
        const event: ISeraphEvent = this.createSeraphEvent(
          SeraphEvents.middlewareExecution,
          { middlewareExecution: data }
        )
        this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
      }
    )

    this.seraphCore.on(
      'middlewareResult',
      (data: SeraphEventTypes['middlewareResult']) => {
        const event: ISeraphEvent = this.createSeraphEvent(
          SeraphEvents.middlewareResult,
          { middlewareResult: data }
        )
        this.pubSub.publish(AGENT_SERAPH_EVENT(this.agentId), event)
      }
    )
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

  public async processInput(
    userInput: string,
    conversationId: string,
    iterate: boolean = true
  ): Promise<void> {
    for await (const response of this.seraphCore.processInput(
      userInput,
      conversationId,
      iterate
    )) {
      const event: ISeraphEvent = this.createSeraphEvent(SeraphEvents.message, {
        message: response,
      })
      this.emit('message', event)
    }
  }
}
