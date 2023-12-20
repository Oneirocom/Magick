import Agent from './Agent'
import { AGENT_COMMAND, AGENT_COMMAND_PROJECT } from 'shared/core'
import { RedisPubSub } from 'server/redis-pubsub'

export interface CommandListener<T> {
  callback: (data: T, agent: Agent) => void
}

/**
 * CommandHub class that handles incoming commands and publishes events to listeners.
 */
export class CommandHub {
  /**
   * The agent instance.
   */
  private agent: Agent
  /**
   * The event map that stores the listeners for each event type.
   */
  private eventMap: { [key: string]: CommandListener<any>[] } = {}
  /**
   * The worker instance.
   */
  private pubsub: RedisPubSub

  /**
   * Creates a new CommandHub instance.
   * @param agent - The agent instance.
   * @param worker - The worker instance.
   */
  constructor(agent: Agent, pubsub: RedisPubSub) {
    this.agent = agent

    // Generate queue name
    const agentCommandEventName = AGENT_COMMAND(this.agent.id)
    const agentProjectEvent = AGENT_COMMAND_PROJECT(this.agent.projectId)

    // Initialize the worker
    this.pubsub = pubsub

    // Subscribe to the queue
    this.pubsub.subscribe(
      agentCommandEventName,
      this.handleIncomingCommand.bind(this)
    )

    // Subscribe to the project queue so we can command all agents in a project
    this.pubsub.subscribe(
      agentProjectEvent,
      this.handleIncomingCommand.bind(this)
    )
  }

  /**EventHandles incoming commands and publishes events to listeners.
   * @param job - The job data.
   */
  private async handleIncomingCommand(job: any) {
    this.agent.log(
      `Received command: ${job.command} with data: ${JSON.stringify(job.data)}`
    )
    const { command } = job

    // if (!commandId) {
    //   this.agent.error('Received command without a commandId')
    //   // Log this to your error handling mechanism
    //   return
    // }

    if (!this.validateEventType(command)) {
      this.agent.error(`Invalid event type received: ${command}`)
      // Log this to your error handling mechanism
      return
    }
    this.publish(command, job.data)
  }

  /**
   * Validates the event type.
   * @param eventType - The event type to validate.
   * @returns True if the event type is valid, false otherwise.
   */
  private validateEventType(eventType: string): boolean {
    if (!eventType) return false
    const parts = eventType.split(':')
    return parts.length === 3
  }

  /**
   * Returns an array of all the event names registered in the eventMap object.
   * @returns {string[]} An array of all the event names registered in the eventMap object.
   */
  listAllEvents() {
    return Object.keys(this.eventMap)
  }

  /**
   * Registers a plugin with the given name and actions.
   * @param pluginName - The name of the plugin.
   * @param actions - An object containing the actions to register.
   */
  registerPlugin(
    pluginName: string,
    actions: { [key: string]: (data: any) => void }
  ) {
    this.registerDomain('plugin', pluginName, actions)
  }

  /**
   * Registers a list of commands for the given domain and subdomain.
   * @param domain - The domain to register the commands for.
   * @param subdomain - The subdomain to register the commands for.
   * @param commands - An object containing the commands to register.
   * @example
   * registerDomain('agent', 'core', {
   *  toggleLive: async (data: any) => {
   *   this.spellManager.toggleLive(data)
   *  },
   * });
   */
  registerDomain(
    domain: string,
    subdomain: string,
    commands: { [key: string]: (data: any) => void }
  ) {
    for (const command of Object.keys(commands)) {
      const eventType = `${domain}:${subdomain}:${command}`
      this.agent.log(`Registering event type: ${eventType}`)
      this.on(eventType, { callback: commands[command] })
    }
  }

  /**
   * Adds a listener for the given event type.
   * @param eventType - The event type to listen for.
   * @param listener - The listener to add.
   */
  on<T>(eventType: string, listener: CommandListener<T>) {
    if (!this.eventMap[eventType]) {
      this.eventMap[eventType] = []
    }
    this.eventMap[eventType].push(listener)
  }

  /**
   * Removes a listener for the given event type.
   * @param eventType - The event type to remove the listener from.
   * @param listener - The listener to remove.
   */
  off(eventType: string, listener: CommandListener<any>) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Publishes an event to all listeners for the given event type.
   * @param eventType - The event type to publish.
   * @param data - The data to publish.
   */
  private publish(eventType: string, data: any) {
    const listeners = this.eventMap[eventType]
    if (listeners) {
      listeners.forEach(listener => listener.callback(data, this.agent))
    }
  }
}
