import { GraphNodes, IStateService } from '@magickml/behave-graph'
import { EventPayload } from 'server/plugin'

export interface IEventStore {
  currentEvent: () => EventPayload | null
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

type EventWithKey = EventPayload & { stateKey: string }

export class EventStore implements IEventStore {
  private asyncNodeCounter: number = 0
  private _currentEvent: EventPayload | null
  private status: StatusEnum
  private stateService: IStateService
  private graphNodes!: GraphNodes

  constructor(stateService: IStateService) {
    this.stateService = stateService
    this._currentEvent = null
    this.status = StatusEnum.INIT
  }

  public init(graphNodes: GraphNodes) {
    this._currentEvent = null
    this.graphNodes = graphNodes
    this.status = StatusEnum.READY
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
