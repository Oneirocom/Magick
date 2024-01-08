import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'
import Redis from 'ioredis'
import { SpellCaster } from 'server/grimoire'

// This is the interface you'll use to get and set variables.
export interface IVariableService {
  setVariable(name: string, value: any): Promise<void>
  getVariable(name: string): Promise<any>
}

// This is the class you'll use to get and set variables.
export class VariableService {
  private keyv: Keyv
  private spellCaster: SpellCaster
  private agentId: string

  constructor(connection: Redis, agentId: string, spellCaster: SpellCaster) {
    const keyvRedis = new KeyvRedis(connection)
    this.keyv = new Keyv({ store: keyvRedis })
    this.agentId = agentId
    this.spellCaster = spellCaster
  }

  getKey(name: string) {
    // also grab event from eventstore in dependencies
    // check
    return `agent:${this.agentId}:spell:${this.spellCaster.spell.id}:variable:${name}`
  }

  // Set a variable in the storage.
  async setVariable(name: string, value: any): Promise<void> {
    const key = this.getKey(name)
    await this.keyv.set(key, value)
  }

  // Get a variable from the storage.
  async getVariable(name: string): Promise<any> {
    const key = this.getKey(name)
    const value = await this.keyv.get(key)
    return value
  }
}
