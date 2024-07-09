import { inject, injectable } from 'inversify'
import { Agent, BaseAgentEvents } from '../Agent'
import {
  CommandListener,
  ICommandHub,
  commandJob,
} from '../interfaces/ICommandHub'
import { IPubSub } from '../interfaces/IPubSub'
import { TYPES } from './index'

@injectable()
export class CommandHub implements ICommandHub {
  private eventMap: { [key: string]: CommandListener<any, Agent>[] } = {}

  constructor(
    @inject<Agent>(TYPES.Agent) private agent: Agent,
    @inject(TYPES.PubSub) private pubsub: IPubSub
  ) {
    this.initialize()
  }

  initialize() {
    // Subscribe to all events
    this.pubsub.subscribe<commandJob>(
      '*',
      this.handleIncomingCommand.bind(this)
    )

    // Listen for all events on the agent
    this.agent.onAny(this.handleAgentEvent.bind(this))
  }

  async handleIncomingCommand(
    data: commandJob,
    channel: keyof BaseAgentEvents
  ) {
    // check of this is a valid event
    if (!this.validateEventType(channel)) {
      return
    }

    // Emit the event through the agent
    this.agent.emit(channel, data as any)
  }

  private handleAgentEvent(eventName: string, ...args: any[]) {
    if (this.validateEventType(eventName)) {
      this.publish(eventName, args[0])
    }
  }

  private validateEventType(eventType: string): boolean {
    if (!eventType) return false
    const parts = eventType.split(':')
    return parts.length === 3
  }

  listAllEvents(): string[] {
    return Object.keys(this.eventMap)
  }

  registerPlugin(
    pluginName: string,
    commands: { [key: string]: (data: any) => void }
  ) {
    this.registerDomain('plugin', pluginName, commands)
  }

  registerDomain(
    domain: string,
    subdomain: string,
    commands: { [key: string]: (data: any) => void }
  ) {
    for (const [command, handler] of Object.entries(commands)) {
      const eventType = `${domain}:${subdomain}:${command}`
      this.on(eventType, { callback: handler })
    }
  }

  on<T>(eventType: string, listener: CommandListener<T, Agent>) {
    if (!this.eventMap[eventType]) {
      this.eventMap[eventType] = []
    }
    this.eventMap[eventType].push(listener)
  }

  off(eventType: string, listener: CommandListener<any, Agent>) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  publish(eventType: string, data: any) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      listeners.forEach(listener => listener.callback(data, this.agent))
    }
  }

  async onDestroy(): Promise<void> {
    // try {
    await this.pubsub.unsubscribe('*')
    //   this.agent.logger.debug(
    //     `CommandHub: Unsubscribed from PubSub for agent ${this.agent.id}`
    //   )
    // } catch (error) {
    //   this.agent.logger.error(
    //     `CommandHub: Error unsubscribing from PubSub: ${error}`
    //   )
    // }

    // Clear local event listeners
    this.eventMap = {}

    // Remove the 'any' event listener from the agent
    this.agent.offAny(this.handleAgentEvent)

    // this.agent.logger.info(
    //   `CommandHub: CommandHub instance for agent ${this.agent.id} destroyed`
    // )
  }
}
