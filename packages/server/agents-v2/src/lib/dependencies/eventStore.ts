import { GraphNodes, IStateService } from '@magickml/behave-graph'
import TypedEmitter from 'typed-emitter'
import { ActionPayload, EventPayload } from '@magickml/shared-services'
import { EventTypes, SEND_MESSAGE } from '@magickml/agent-communication'
import EventEmitter from 'events'
import {
  EventStoreEvents,
  EventWithKey,
  IEventStore,
  Message,
  StatusEnum,
} from '../interfaces/IEventStore'
import { EventProperties, IDatabaseService } from '../interfaces/IDatabase'
import { getEventProperties } from '../utils/eventUtils'
import { Agent } from '../Agent'
import { inject, injectable } from 'inversify'
import { TYPES } from './index'

@injectable()
export class EventStore
  extends (EventEmitter as new () => TypedEmitter<EventStoreEvents>)
  implements IEventStore
{
  private asyncNodeCounter: number = 0
  private _currentEvent: EventPayload | null
  private _initialEvent: EventPayload | null
  private status: StatusEnum
  private graphNodes!: GraphNodes
  private agentId: string

  constructor(
    @inject(TYPES.GraphStateService) private stateService: IStateService,
    @inject(TYPES.Database) private database: IDatabaseService,
    @inject(TYPES.Agent) private agent: Agent
  ) {
    super()
    this._currentEvent = null
    this._initialEvent = null
    this.status = StatusEnum.INIT
    this.agent = agent
    this.agentId = agent.id
  }

  public init(graphNodes: GraphNodes) {
    this._currentEvent = null
    this.graphNodes = graphNodes
    this.status = StatusEnum.READY
  }

  public async saveAgentMessage(content: string) {
    const event = this.currentEvent()

    if (!event) return

    return this.saveAgentEvent({
      ...event,
      data: { content },
      event,
      actionName: SEND_MESSAGE,
    })
  }

  public getKey() {
    if (!this.currentEvent()) return null
    return this.currentEvent()!.stateKey || null
  }

  public async saveUserMessage(content: string) {
    const event = this.currentEvent()

    if (!event) return

    return this.saveUserEvent({
      event,
      data: { content },
      actionName: SEND_MESSAGE,
    })
  }

  public async addMessage(content: string, role: 'user' | 'assistant') {
    if (role === 'user') {
      await this.saveUserMessage(content)
    } else {
      await this.saveAgentMessage(content)
    }
  }

  public async saveAgentEvent(data: ActionPayload) {
    await this.database.saveGraphEvent({
      sender: this.agentId,
      // we are assuming here that the observer of this action is the
      //  original sender.  We may be wrong.
      observer: data.event.sender,
      agentId: this.agentId,
      connector: data.event.connector,
      connectorData: JSON.stringify(data.event.data),
      content: data.data.content,
      eventType: data.actionName,
      event: data.event as EventPayload,
    })
  }

  public async saveUserEvent(data: ActionPayload) {
    await this.database.saveGraphEvent({
      sender: data.event.sender,
      observer: this.agentId,
      agentId: this.agentId,
      connector: data.event.connector,
      connectorData: JSON.stringify(data.event.data),
      content: data.data.content,
      eventType: data.actionName,
      event: data.event as EventPayload,
    })
  }

  public async deleteMessages(eventPropertyKeys: EventProperties[]) {
    const eventTypes = [EventTypes.ON_MESSAGE, EventTypes.SEND_MESSAGE]
    const events = await this.queryEvents(eventPropertyKeys, eventTypes)

    const eventIds = events.map((event: any) => event.id)

    await this.database.deleteMessages(this.agentId, eventIds)
  }

  public async getMessages(
    eventPropertyKeys: EventProperties[],
    limit: number = 100,
    alternateRoles: boolean = false
  ) {
    eventPropertyKeys.push('from user')
    eventPropertyKeys.push('to user')
    const eventTypes = [EventTypes.ON_MESSAGE, EventTypes.SEND_MESSAGE]
    const events = await this.queryEvents(eventPropertyKeys, eventTypes, limit)

    const transformed = [] as Message[]
    let expectedRole = 'assistant' // Start with 'assistant' role

    for (const event of events) {
      const role = event.sender === this.agentId ? 'assistant' : 'user'

      if (!event.content) {
        // if this is an assistant message, also remove last user message
        if (role === 'assistant') {
          transformed.pop()
        }
        continue
      }

      if (alternateRoles) {
        if (role === expectedRole) {
          transformed.push({
            role,
            content: event.content,
          })

          // Update the expected role for the next message
          expectedRole = role === 'assistant' ? 'user' : 'assistant'
        }
      } else {
        transformed.push({
          role,
          content: event.content,
        })
      }
    }

    return transformed
  }

  public async queryEvents(
    eventPropertyKeys: EventProperties[],
    messageTypes: string[],
    limit: number = 100
  ) {
    if (!this._currentEvent) return null

    const fromUser = eventPropertyKeys.includes('from user')
    const toUser = eventPropertyKeys.includes('to user')

    const eventProperties = getEventProperties(
      this._currentEvent,
      eventPropertyKeys
    ) as any

    if (fromUser) eventProperties['fromUser'] = this._currentEvent.sender
    if (toUser) eventProperties['toUser'] = this._currentEvent.sender

    const query = {
      agentId: this.agentId,
      eventTypes: messageTypes,
      ...eventProperties,
    }

    query['$limit'] = limit

    const results = await this.database.queryEvents({
      agentId: this.agentId,
      eventPropertyKeys,
      messageTypes,
      limit,
    })

    return results
  }

  public currentEvent(): EventPayload | null {
    return this._currentEvent || this._initialEvent
  }

  public initialEvent(): EventPayload | null {
    return this._initialEvent
  }

  public setInitialEvent(event: EventPayload) {
    this._initialEvent = event
  }

  public async setEvent(event: EventWithKey) {
    if (!this._initialEvent) {
      this._initialEvent = event

      // rehydrate the state here for the graph since we are starting a new event
      await this.stateService.rehydrateState(this.graphNodes, event.stateKey)
    } else {
      // lets sync the state from the last event before we set the new one to make sure we are up to date
      // This doesnt actually clear from the state for now.
      this.stateService.syncState()
    }

    this._currentEvent = event

    this.status = StatusEnum.RUNNING
  }

  /**
   * Check if the event is ready
   *
   * @returns {boolean} True if the event is ready
   */
  public isReady() {
    return this.status === StatusEnum.READY
  }

  /**
   * Check if the event is running
   *
   * @returns {boolean} True if the event is running
   */
  public isRunning() {
    return (
      this.status === StatusEnum.RUNNING ||
      this.status === StatusEnum.AWAIT ||
      this.status === StatusEnum.DONE
    )
  }

  public getStatus() {
    return this.status
  }

  public await() {
    this.status = StatusEnum.AWAIT
    this.asyncNodeCounter++
  }

  public finish() {
    if (this.asyncNodeCounter > 0) {
      this.asyncNodeCounter-- // Decrement the counter when an async node finishes
    }
    // Only change the status to RUNNING if all async nodes have finished
    if (this.asyncNodeCounter === 0) {
      this.status = StatusEnum.DONE
      this.done()
    }
  }

  public async done() {
    // always sync the state here on done
    this.stateService.syncState()
    // If the event status is awaiting, it means the engine is waiting for the event to be done.
    // So we don't want to change the status to done yet.
    // We assume that another process will change the status to done when the event is complete.
    if (this.status === StatusEnum.AWAIT) return

    // We sync the state and clear it from the state service after the event is done.

    if (this.asyncNodeCounter === 0) {
      // If there are no async nodes, we can change the status ready, showing it is ready for the next event.
      this.status = StatusEnum.READY

      // TODO make this an agent event
      // this.emit('done', this._currentEvent)
      await this.stateService.syncState()
    }
  }
}
