import { IGraph, IStateService } from '@magickml/behave-graph'
import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'
import Redis from 'ioredis'

import { IEventStore } from './eventStore'
import { EventPayload } from 'server/plugin'

export class KeyvStateService implements IStateService {
  private stateStore: Record<string, any>
  private eventStore?: IEventStore
  private keyv: Keyv

  constructor(connection: Redis) {
    this.stateStore = {}
    const keyvRedis = new KeyvRedis(connection)
    this.keyv = new Keyv({ store: keyvRedis })
  }

  init(graph: IGraph) {
    this.eventStore = graph.getDependency('IEventStore')
  }

  // eslint-disable-next-line
  formatKey(nodeId: string, _: EventPayload): string {
    return `${nodeId}:}`
  }

  storeEvent(event: any) {
    this.eventStore?.setEvent(event)
  }

  getState(nodeId: string): any {
    // check first if the key is in the local store
    if (this.stateStore[nodeId]) {
      return this.stateStore[nodeId]
    }

    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        // const key = `${nodeId}:${event.channel}:${event.sender}`
        const key = `${nodeId}`
        return this.keyv.get(key) || null
      }
    }

    return this.keyv.get(nodeId) || null
  }

  setState(nodeId: string, newState: any): void {
    // check if newState is a function
    // if it is, store it as a function in the local state store
    if (typeof newState === 'function') {
      this.stateStore[nodeId] = newState
      return
    }

    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        // const key = `${nodeId}:${event.channel}:${event.sender}`
        const key = `${nodeId}`
        this.keyv.set(key, newState)
        return
      }
    }

    this.keyv.set(nodeId, newState)
  }
}
