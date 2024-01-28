import { GraphNodes } from '@magickml/behave-graph'
import { EventPayload } from 'server/plugin'

export interface IEventStore {
  currentEvent: () => EventPayload | null
  setEvent: (event: EventPayload) => void
  init: (nodes: GraphNodes) => void
  getStatus: () => StatusEnum
  done: () => void
}

export enum StatusEnum {
  INIT = 'INIT',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERRORED = 'ERRORED',
}

export class EventStore implements IEventStore {
  private _currentEvent: EventPayload | null
  private status: StatusEnum

  constructor() {
    this._currentEvent = null
    this.status = StatusEnum.INIT
  }

  public init() {
    this._currentEvent = null
  }

  public currentEvent(): EventPayload | null {
    return this._currentEvent
  }

  public setEvent(event: EventPayload) {
    this._currentEvent = event

    if (this.status === StatusEnum.INIT) {
      this.status = StatusEnum.RUNNING
    }
  }

  public getStatus() {
    return this.status
  }

  public done() {
    this.status = StatusEnum.DONE
  }
}
