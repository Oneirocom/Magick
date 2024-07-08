import { Agent } from '../Agent'
import { IPubSub } from './IPubSub'

export interface CommandListener<T, A = Agent> {
  callback: (data: T, agent: A) => void
}

export type commandJob = {
  command: string
  data: any
}

export interface ICommandHub {
  initialize(): void
  handleIncomingCommand(job: commandJob): Promise<void>
  registerDomain(
    domain: string,
    subdomain: string,
    commands: { [key: string]: (data: any) => void }
  ): void
  on<T>(eventType: string, listener: CommandListener<T>)
  off(eventType: string, listener: CommandListener<any>)
  publish(eventType: string, data: any)
  onDestroy(): Promise<void>
  listAllEvents(): string[]
}

export type ICommandHubArgs = {
  agent: Agent
  pubsub: IPubSub
}
