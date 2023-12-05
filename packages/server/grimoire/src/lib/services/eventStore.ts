import { EventPayload } from 'server/plugin'

export interface IEventStore {
  currentEvent: () => EventPayload<unknown> | null
  setEvent: (event: EventPayload<unknown>) => void
}

export class EventStore implements IEventStore {
  private _currentEvent: EventPayload<unknown> | null

  constructor() {
    this._currentEvent = null
  }

  public currentEvent(): EventPayload<unknown> | null {
    return this._currentEvent
  }

  public setEvent(event: EventPayload<unknown>) {
    this._currentEvent = event
  }
}
