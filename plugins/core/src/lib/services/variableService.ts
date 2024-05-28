import Keyv from 'keyv'
import { EventStore, SpellCaster } from 'server/grimoire'
import { ArrayVariable, ArrayVariableData } from '../values/Array/ArrayVariable'
import { CORE_DEP_KEYS } from '../config'
import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'
import { EventPayload } from 'server/plugin'

type Payload = {
  name: string
  value: any
  lastValue: any
  event: EventPayload
}

export type VariableServiceEvents = {
  variableChanged: (payload: Payload) => void
}

// This is the interface you'll use to get and set variables.
export interface IVariableService extends TypedEmitter<VariableServiceEvents> {
  setVariable(name: string, value: any, skipSend?: boolean): Promise<void>
  getVariable(name: string): Promise<any>

  setByKey(key: string, value: any, skipSend?: boolean): Promise<void>
  getByKey(key: string): Promise<any>
}

// This is the class you'll use to get and set variables.
export class VariableService
  extends (EventEmitter as new () => TypedEmitter<VariableServiceEvents>)
  implements IVariableService
{
  private keyv: Keyv
  private spellCaster: SpellCaster
  private agentId: string

  constructor(postgresUrl: string, agentId: string, spellCaster: SpellCaster) {
    super()
    this.keyv = new Keyv(postgresUrl, {
      namespace: agentId,
      schema: 'variables',
    })
    this.agentId = agentId
    this.spellCaster = spellCaster
  }

  get eventStore(): EventStore {
    const eventStore = this.spellCaster.graph.getDependency<EventStore>(
      CORE_DEP_KEYS.EVENT_STORE
    )

    if (!eventStore) {
      throw new Error('Event store not found')
    }

    return eventStore
  }

  get currentEvent() {
    const currentEvent = this.eventStore.currentEvent()
    if (!currentEvent) {
      throw new Error('Current event not found')
    }

    return currentEvent
  }

  getEventKey(): string | undefined {
    const event = this.eventStore.currentEvent()
    if (!event || !event.stateKey) return undefined

    return event.stateKey
  }

  getKey(name: string) {
    const baseKey = `agent:${this.agentId}:spell:${this.spellCaster.spell.id}:variable:${name}`
    const eventKey = this.getEventKey()

    if (!eventKey) return baseKey

    return `${baseKey}:${eventKey}`
  }

  getNameFromKey(key: string) {
    const parts = key.split(':')
    return parts[parts.length - 1]
  }

  async setByKey(key: string, value: any, skipSend = false): Promise<void> {
    await this.keyv.set(key, value)
    const name = this.getNameFromKey(key)
    const lastValue = await this.keyv.get(key)

    if (skipSend) return
    this.emit('variableChanged', {
      name,
      value,
      lastValue,
      event: this.currentEvent,
    })
  }

  async getByKey(key: string): Promise<any> {
    let value = await this.keyv.get(key)
    if (Array.isArray(value)) {
      value = new ArrayVariable(value, key)
    }

    return value
  }

  // Set a variable in the storage.
  async setVariable(name: string, value: any, skipSend = false): Promise<void> {
    const key = this.getKey(name)

    if (Array.isArray(value)) {
      value = new ArrayVariable(value, key)
    }
    const lastValue = await this.keyv.get(key)
    await this.keyv.set(key, value)
    if (skipSend) return
    this.emit('variableChanged', {
      name,
      value,
      lastValue,
      event: this.currentEvent,
    })
  }

  // Get a variable from the storage.
  async getVariable(name: string): Promise<any> {
    const key = this.getKey(name)
    let value = await this.keyv.get(key)

    if (value && Array.isArray(value)) {
      value = new ArrayVariable(value, key)
      return value
    }

    if (value && ArrayVariable.isInstance(value)) {
      value = ArrayVariable.fromJSON(value as ArrayVariableData)
      return value
    }

    return value
  }
}
