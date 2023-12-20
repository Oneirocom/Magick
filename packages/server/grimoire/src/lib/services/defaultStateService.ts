import { IGraph, IStateService } from '@magickml/behave-graph'
import { IEventStore } from './eventStore'
import { EventPayload } from 'server/plugin'

export class DefaultStateService implements IStateService {
  private stateStore: Record<string, any>
  private eventStore?: IEventStore

  constructor() {
    this.stateStore = {}
  }

  init(graph: IGraph) {
    this.eventStore = graph.getDependency('IEventStore')
  }

  // eslint-disable-next-line
  formatKey(nodeId: string, event: EventPayload): string {
    return `${nodeId}}`
  }

  storeEvent(event: any) {
    this.eventStore?.setEvent(event)
  }

  getState(nodeId: string): any {
    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        // const key = `${nodeId}:${event.channel}:${event.sender}`
        const key = `${nodeId}`
        return this.stateStore[key] || null
      }
    }

    return this.stateStore[nodeId] || null
  }

  setState(nodeId: string, newState: any): void {
    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        // const key = `${nodeId}:${event.channel}:${event.sender}`
        const key = `${nodeId}`
        this.stateStore[key] = newState
        return
      }
    }

    this.stateStore[nodeId] = newState
  }
}
