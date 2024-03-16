import { type EventPayload } from '../events/event-manager'
import { getLogger } from 'server/logger'
import { saveGraphEvent } from 'server/core'

export interface ActionPayload<T = unknown, Y = unknown> {
  actionName: string
  event: EventPayload<T, Y>
  data: any
}

/**
 * Interface for defining an action.
 * @property actionName - The unique name of the action, typically namespaced.
 * @property displayName - A user-friendly name for the action.
 * @property handler - The handler for the action.
 */
export interface ActionDefinition<T extends string = string> {
  actionName: T
  displayName: string
  handler: (ActionPayload) => void | Promise<void>
}

export type ActionDefinitionInfo = Omit<ActionDefinition, 'handler'>

export class BaseActionManager {
  protected logger = getLogger()
  protected agentId: string
  protected actions: ActionDefinition[] = []

  constructor(agentId: string) {
    this.agentId = agentId
  }

  registerAction(action: ActionDefinition) {
    console.log('!!registerAction:', action)
    this.actions.push(action)
    console.log('!!actions:', this.actions)
  }

  getActions(): ActionDefinition[] {
    return this.actions
  }

  async handleAction(data: ActionPayload) {
    this.logger.trace(`Handling action ${data.actionName}`)

    const action = this.actions.find(
      action => action.actionName === data.actionName
    )

    if (!action) {
      this.logger.warn(`No action found for ${data.actionName}`)

      return
    }
    this.logger.trace(`Action ${data.actionName} found.  Handling...`)
    await action.handler(data as ActionPayload)

    // const { actionName, event } = data
    saveGraphEvent({
      sender: this.agentId,
      // we are assuming here that the observer of this action is the
      //  original sender.  We may be wrong.
      observer: data.event.sender,
      agentId: this.agentId,
      connector: data.event.connector,
      connectorData: JSON.stringify(data.event.data),
      content: data.data.content,
      eventType: data.actionName,
      event: data.event as EventPayload,
    })
  }
}
