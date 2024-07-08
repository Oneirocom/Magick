import { Agent, BaseAgentEvents } from '../Agent'
import { CommandListener } from '../interfaces/ICommandHub'
import { IPubSub } from '../interfaces/IPubSub'

export class CommandHub<A extends Agent = Agent> {
  private eventMap: { [key: string]: CommandListener<any, A>[] } = {}

  constructor(private agent: A, private pubsub: IPubSub) {
    this.initialize()
  }

  private initialize() {
    // Subscribe to all events
    this.pubsub.subscribe('*', this.handleIncomingCommand.bind(this))

    // Listen for all events on the agent
    this.agent.onAny(this.handleAgentEvent.bind(this))
  }

  private async handleIncomingCommand(event: keyof BaseAgentEvents, data: any) {
    if (!this.validateEventType(event)) {
      this.agent.emit(
        'error',
        new Error(`Invalid event type received: ${event}`)
      )
      return
    }

    // Emit the event through the agent
    this.agent.emit(event, data)
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

  on<T>(eventType: string, listener: CommandListener<T, A>) {
    if (!this.eventMap[eventType]) {
      this.eventMap[eventType] = []
    }
    this.eventMap[eventType].push(listener)
  }

  off(eventType: string, listener: CommandListener<any, A>) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private publish(eventType: string, data: any) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      listeners.forEach(listener => listener.callback(data, this.agent))
    }
  }

  async onDestroy(): Promise<void> {
    try {
      await this.pubsub.unsubscribe('*')
      this.agent.logger.debug(
        `CommandHub: Unsubscribed from PubSub for agent ${this.agent.id}`
      )
    } catch (error) {
      this.agent.logger.error(
        `CommandHub: Error unsubscribing from PubSub: ${error}`
      )
    }

    // Clear local event listeners
    this.eventMap = {}

    // Remove the 'any' event listener from the agent
    this.agent.offAny(this.handleAgentEvent)

    this.agent.logger.info(
      `CommandHub: CommandHub instance for agent ${this.agent.id} destroyed`
    )
  }
}
