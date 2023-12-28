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

  // warning: if we change this key, all agents will lose access to their state
  formatKey(nodeId: string, event: EventPayload): string {
    let baseKey = `${nodeId}`
    const stateKey = event.stateKey

    if (stateKey === undefined) return baseKey

    return `${baseKey}:${stateKey}`
  }

  storeEvent(event: any) {
    this.eventStore?.setEvent(event)
  }

  async getState(nodeId: string): Promise<any> {
    // check first if the key is in the local store
    if (this.stateStore[nodeId]) {
      return this.stateStore[nodeId]
    }

    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        const key = this.formatKey(nodeId, event)
        return (await this.keyv.get(key)) || null
      }
    }

    return (await this.keyv.get(nodeId)) || null
  }

  async setState(nodeId: string, newState: any): Promise<void> {
    // check if newState is a function
    // if it is, store it as a function in the local state store
    if (typeof newState === 'function') {
      this.stateStore[nodeId] = newState
      return
    }

    if (this.eventStore) {
      const event = this.eventStore.currentEvent()

      if (event) {
        const key = this.formatKey(nodeId, event)
        await this.keyv.set(key, newState)
        return
      }
    }

    await this.keyv.set(nodeId, newState)
  }
}
