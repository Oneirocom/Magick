import { Agent } from '../Agent'

interface Service {
  apply(agent: Agent): void | Promise<void>
}

export { Service }
