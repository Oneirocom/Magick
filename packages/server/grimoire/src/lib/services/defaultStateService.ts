import { IGraph, IStateService } from '@magickml/behave-graph'
import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'
import Redis from 'ioredis'

import { EventStore, IEventStore } from './eventStore'
import { EventPayload } from 'server/plugin'
import { CORE_DEP_KEYS } from 'plugin/core'

export class DefaultStateService implements IStateService {
  private stateStore: Record<string, any>
  private eventStore?: IEventStore
  private keyv: Keyv

  constructor(connection: Redis) {
    this.stateStore = {}
    const keyvRedis = new KeyvRedis(connection)
    this.keyv = new Keyv({ store: keyvRedis })
  }

  init(graph: IGraph) {
    this.eventStore = graph.getDependency<EventStore>(CORE_DEP_KEYS.EVENT_STORE)
  }

  // eslint-disable-next-line
  formatKey(nodeId: string, event: EventPayload): string {
    return `${nodeId}}`
  }

  storeEvent(event: any) {
    this.eventStore?.setEvent(event)
  }

  async resetState() {
    this.stateStore = {}
  }

  getState(nodeId: string): any {
    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        // const key = `${nodeId}:${event.channel}:${event.sender}`
        const key = `${nodeId}`
        return this.keyv.get(key) || null
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
        this.keyv.set(key, newState)
        return
      }
    }

    this.stateStore[nodeId] = newState
  }

  async rehydrateState(): Promise<void> {}

  async syncAndClearState(): Promise<void> {}
}
