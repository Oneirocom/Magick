import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'
import Redis from 'ioredis'
import { IEventStore } from 'server/grimoire'

// This is the interface you'll use to get and set variables.
export interface IVariableService {
  setVariable(name: string, value: any): Promise<void>
  getVariable(name: string): Promise<any>
}

// This is the class you'll use to get and set variables.
export class IVariableService {
  private keyv: Keyv

  constructor(connection: Redis) {
    const keyvRedis = new KeyvRedis(connection)
    this.keyv = new Keyv({ store: keyvRedis })
  }

  // Set a variable in the storage.
  async setVariable(name: string, value: any): Promise<void> {
    await this.keyv.set(name, value)
  }

  // Get a variable from the storage.
  async getVariable(name: string): Promise<any> {
    return await this.keyv.get(name)
  }
}
