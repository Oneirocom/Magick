import { type Worker } from '@magickml/server-core'
import Agent from './Agent'
import { AGENT_COMMAND_JOB } from '@magickml/core'

export interface CommandListener<T> {
  callback: (data: T) => void
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
  private worker: Worker

  /**
   * Creates a new CommandHub instance.
   * @param agent - The agent instance.
   * @param worker - The worker instance.
   */
  constructor(agent: Agent, worker: Worker) {
    this.agent = agent

    // Generate queue name
    const queueName = AGENT_COMMAND_JOB(this.agent.id)

    // Initialize the worker
    this.worker = worker
    // set the worker listenening to the queue
    this.worker.initialize(queueName, this.handleIncomingCommand.bind(this))
  }

  /**
   * Handles incoming commands and publishes events to listeners.
   * @param job - The job data.
   */
  private async handleIncomingCommand(job: any) {
    const { commandId, eventType } = job.data

    if (!commandId) {
      this.agent.error('Received command without a commandId')
      // Log this to your error handling mechanism
      return
    }

    if (!this.validateEventType(eventType)) {
      this.agent.error(`Invalid event type received: ${eventType}`)
      // Log this to your error handling mechanism
      return
    }
    this.publish(eventType, job.data)
  }

  /**
   * Validates the event type.
   * @param eventType - The event type to validate.
   * @returns True if the event type is valid, false otherwise.
   */
  private validateEventType(eventType: string): boolean {
    const parts = eventType.split(':')
    return parts.length === 3
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
    for (const action of Object.keys(actions)) {
      const eventType = `plugin:${pluginName}:${action}`
      this.on(eventType, { callback: actions[action] })
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
      listeners.forEach(listener => listener.callback(data))
    }
  }
}
