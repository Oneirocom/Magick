import { Redis } from 'ioredis'

export interface IRedis {
  getClient(): Redis
}
