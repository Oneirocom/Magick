import { GraphNodes, IStateService } from '@magickml/behave-graph'
import { Application, saveGraphEvent } from 'server/core'
import { ActionPayload, EventPayload } from 'server/plugin'
import { getEventProperties } from '../utils'
import { EventTypes, SEND_MESSAGE } from 'communication'

type EventProperties =
  | 'sender'
  | 'agentId'
  | 'connector'
  | 'channel'
  | 'from user'
  | 'to user'

export interface IEventStore {
  currentEvent: () => EventPayload | null
  queryEvents: (
    eventPropertyKeys: EventProperties[],
    messageTypes: string[],
    limit?: number
  ) => any
  saveAgentMessage: (content: string) => void
  saveAgentEvent: (data: ActionPayload) => void
  getMessages: (
    eventPropertyKeys: EventProperties[],
    limit?: number
  ) => Promise<Message[]>
  setEvent: (event: EventWithKey) => void
  init: (nodes: GraphNodes) => void
  finish: () => void
  done: () => void
  await: () => void
  getStatus: () => StatusEnum
}

export enum StatusEnum {
  INIT = 'INIT',
  READY = 'READY',
  AWAIT = 'AWAIT',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERRORED = 'ERRORED',
}

type Message = {
  role: string
  content: string
}

type EventWithKey = EventPayload & { stateKey: string }

export class EventStore implements IEventStore {
  private asyncNodeCounter: number = 0
  private _currentEvent: EventPayload | null
  private status: StatusEnum
  private stateService: IStateService
  private graphNodes!: GraphNodes
  private app: Application
  private agentId: string

  constructor(stateService: IStateService, app: Application, agentId: string) {
    this.stateService = stateService
    this._currentEvent = null
    this.status = StatusEnum.INIT
    this.app = app
    this.agentId = agentId
  }

  public init(graphNodes: GraphNodes) {
    this._currentEvent = null
    this.graphNodes = graphNodes
    this.status = StatusEnum.READY
  }

  public saveAgentMessage(content: string) {
    const event = this.currentEvent()

    if (!event) return

    this.saveAgentEvent({
      ...event,
      data: { content },
      event,
      actionName: SEND_MESSAGE,
    })
  }

  public async saveAgentEvent(data: ActionPayload) {
    saveGraphEvent({
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

  public async getMessages(
    eventPropertyKeys: EventProperties[],
    limit: number = 100
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

      if (role === expectedRole) {
        transformed.push({
          role,
          content: event.content,
        })

        // Update the expected role for the next message
        expectedRole = role === 'assistant' ? 'user' : 'assistant'
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

    const graphEventsService = this.app.service('graphEvents')

    const fromUser = eventPropertyKeys['from user']
    const toUser = eventPropertyKeys['to user']

    delete eventPropertyKeys['from user']
    delete eventPropertyKeys['to user']

    const eventProperties = getEventProperties(
      this._currentEvent,
      eventPropertyKeys
    )

    if (fromUser) eventProperties['fromUser'] = this._currentEvent.sender
    if (toUser) eventProperties['toUser'] = this._currentEvent.sender

    const query = {
      agentId: this.agentId,
      eventTypes: messageTypes,
      ...eventProperties,
    }

    query['$limit'] = limit

    const results = await graphEventsService.find({ query })

    return results
  }

  public currentEvent(): EventPayload | null {
    return this._currentEvent
  }

  public async setEvent(event: EventWithKey) {
    this._currentEvent = event

    this.status = StatusEnum.RUNNING

    // We rehydrate the state from the state service when the event is set.
    // This allows us to have the state available for the event.
    await this.stateService.rehydrateState(this.graphNodes, event.stateKey)
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
    }
  }

  public async done() {
    // If the event status is awaiting, it means the engine is waiting for the event to be done.
    // So we don't want to change the status to done yet.
    // We assume that another process will change the status to done when the event is complete.
    if (this.status === StatusEnum.AWAIT) return

    // We sync the state and clear it from the state service after the event is done.
    await this.stateService.syncAndClearState()

    if (this.asyncNodeCounter === 0) {
      // If there are no async nodes, we can change the status ready, showing it is ready for the next event.
      this.status = StatusEnum.READY
    }
  }
}
