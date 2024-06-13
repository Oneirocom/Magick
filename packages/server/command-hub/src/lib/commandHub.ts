import {
  AGENT_COMMAND,
  AGENT_COMMAND_PROJECT,
  MANAGER_COMMAND,
} from 'communication'
import { RedisPubSub } from 'server/redis-pubsub'
import { Agent } from 'server/agents'
import { CloudAgentManagerV2 } from 'server/cloud-agent-manager'

export interface CommandListener<T> {
  callback: (data: T, context: Agent | CloudAgentManagerV2) => void
}

/**
 * CommandHub class that handles incoming commands and publishes events to listeners.
 */
export class CommandHub {
  /**
   * The context instance (Agent or CloudAgentManagerV2).
   */
  private context: Agent | CloudAgentManagerV2
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
   * @param context - The context instance (Agent or CloudAgentManagerV2).
   * @param worker - The worker instance.
   */
  constructor(context: Agent | CloudAgentManagerV2, pubsub: RedisPubSub) {
    this.context = context

    // Generate queue name based on context type
    const contextType = context instanceof Agent ? 'agent' : 'manager'
    const contextEventName =
      contextType === 'agent'
        ? AGENT_COMMAND((context as Agent).id)
        : MANAGER_COMMAND

    // Initialize the pubsub
    this.pubsub = pubsub

    // Subscribe to the queue
    this.pubsub.subscribe(
      contextEventName,
      this.handleIncomingCommand.bind(this)
    )

    if (contextType === 'agent') {
      // Subscribe to the project queue for agents
      const projectEvent = AGENT_COMMAND_PROJECT((context as Agent).projectId)
      this.pubsub.subscribe(projectEvent, this.handleIncomingCommand.bind(this))
    }
  }

  /**
   * Handles incoming commands and publishes events to listeners.
   * @param job - The job data.
   */
  private async handleIncomingCommand(job: any) {
    // this.agent.log(
    //   `Received command: ${job.command} with data: ${JSON.stringify(job.data)}`
    // )
    const { command } = job

    // if (!commandId) {
    //   this.agent.error('Received command without a commandId')
    //   // Log this to your error handling mechanism
    //   return
    // }

    if (!this.validateEventType(command)) {
      if (this.context instanceof Agent) {
        this.context.error(`Invalid event type received: ${command}`)
        return
      } else {
        this.context.logger.error(`Invalid event type received: ${command}`)
      }
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
    commands: { [key: string]: (data: any) => void }
  ) {
    this.registerDomain('plugin', pluginName, commands)
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
      listeners.forEach(listener => listener.callback(data, this.context))
    }
  }

  /**
   * Cleans up resources and performs necessary teardown tasks before destroying the CommandHub instance.
   */
  async onDestroy(): Promise<void> {
    const contextType = this.context instanceof Agent ? 'agent' : 'manager'
    const contextEventName =
      contextType === 'agent'
        ? AGENT_COMMAND((this.context as Agent).id)
        : MANAGER_COMMAND
    try {
      await this.pubsub.unsubscribe(contextEventName)

      if (contextType === 'agent') {
        const projectEvent = AGENT_COMMAND_PROJECT(
          (this.context as Agent).projectId
        )
        await this.pubsub.unsubscribe(projectEvent)
      }
    } catch (error) {
      if (this.context instanceof Agent) {
        this.context.logger.error(
          `CommandHub: Error unsubscribing from Redis PubSub channels: ${error}`
        )
      } else {
        this.context.logger.error(
          `CommandHub: Error unsubscribing from Redis PubSub channels: ${error}`
        )
      }
    }

    // Clear the eventMap to remove all listeners
    this.eventMap = {}

    if (this.context instanceof Agent) {
      this.context.logger.info(
        `CommandHub: CommandHub instance for agent ${this.context.id} destroyed`
      )
    } else {
      this.context.logger.info(
        'CommandHub: CommandHub instance for AgentManager Destroyed'
      )
    }
  }

  /**
   * Method to handle plugin control commands (enable/disable).
   * @param data - The command data containing plugin name and desired state.
   */
  // private handlePluginControlCommand(data: {
  //   pluginName: string
  //   enable: boolean
  // }) {
  //   const { pluginName, enable } = data
  //   // temp disable
  //   // this.agent.pluginManager.setPluginStatus(pluginName, enable)
  // }
}
