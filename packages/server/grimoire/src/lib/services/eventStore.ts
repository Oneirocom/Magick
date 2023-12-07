import { EventPayload } from 'server/plugin'

export interface IEventStore {
  currentEvent: () => EventPayload | null
  setEvent: (event: EventPayload) => void
}

export class EventStore implements IEventStore {
  private _currentEvent: EventPayload | null

  constructor() {
    this._currentEvent = null
  }

  public currentEvent(): EventPayload | null {
    return this._currentEvent
  }

  public setEvent(event: EventPayload) {
    this._currentEvent = event
  }
}
