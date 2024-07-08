import { Container } from 'inversify'
import { Agent } from '../Agent'

export interface IService {
  apply(agent: Agent): void
}

export abstract class BaseService {
  abstract apply(): void

  // Although we can't enforce this, we document that subclasses should implement this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static registerDependencies(_container: Container): void {
    throw new Error('This method should be overridden by subclasses.')
  }
}
