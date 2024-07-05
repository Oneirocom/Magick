import { Agent } from '../Agent'

export interface Service {
  apply(agent: Agent): void | Promise<void>
}
