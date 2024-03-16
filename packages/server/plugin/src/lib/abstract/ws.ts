import { EventEmitter } from 'events'
import BasePlugin, { BasePluginInit } from '../basePlugin'
import { PluginCredentialsType } from 'server/credentials'
import { PluginStateType } from 'plugin-state'
import { EventPayload } from '../events/event-manager'

export type WebSocketPluginState<T extends object = Record<string, unknown>> =
  T & {
    enabled: boolean
    context: Record<string, unknown>
  }

/**
 * Abstract class for a WebSocket-based plugin.
 */
export abstract class WebSocketPlugin<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>,
  Credentials extends PluginCredentialsType = PluginCredentialsType,
  CoreEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends PluginStateType = PluginStateType
> extends BasePlugin<
  Events,
  Actions,
  Dependencies,
  Commands,
  Credentials,
  CoreEvents,
  Payload,
  Data,
  Metadata,
  State
> {
  constructor({ name, connection, agentId, projectId }: BasePluginInit) {
    super({ name, connection, agentId, projectId })
  }

  /**
   * Initializes the plugin.
   * Does nothing different from the parent class currently.
   * @param centralEventBus - The central event bus to use for the plugin.
   */
  override async init(centralEventBus: EventEmitter) {
    super.init(centralEventBus)
  }

  /**
   * Abstract method to handle the login process.
   * This is where the plugin should connect to the service.
   * Credentials will be validated before this method is called.
   * Make sure you setup validation in validateCredentials.
   * That way they are valid regardless of how you typed them. ex: { ['discord-token']: string | undefined }
   * @example: Discord login.
   * async login(credentials: Credentials) {
   *   this.discord.login(credentials['discord-token'])
   *   this.logger.info('Logged in to Discord')
   * }
   * @param credentials - The required credentials.
   */

  abstract login(credentials: Credentials): Promise<void>

  /**
   * Abstract method to validate the login process.
   * This is where the plugin should check if the login was successful.
   * The user could deactive a token, or the service could be down.
   * @returns A boolean or a promise that resolves to a boolean indicating if the login was successful.
   */
  abstract validateLogin(): boolean | Promise<boolean>

  /**
   * Abstract method to validate the permissions for the plugin.
   * This is where the plugin should check if it has the required permissions.
   * @example: Discord validate permissions.
   * async validatePermissions() {
   * return this.discord.user?.hasPermission('SEND_MESSAGES')
   * }
   */
  abstract validatePermissions(): boolean | Promise<boolean>

  /**
   * Abstract method to handle the logout process.
   * This is where the plugin should disconnect from the service.
   * Make sure to unlisten to all events and destroy the connection.
   * @example: Discord logout.
   * async logout() {
   *    this.unlistenAll()
   *    await this.discord.destroy()
   * }
   */
  abstract logout(): Promise<void>

  /**
   * Abstract method to get the plugin context.
   * The context is stored in the plugins state in state.context.
   * Handy way to store things like the bots name or id.
   * Is automatically called when the plugin is enabled.
   * @example: Discord refresh context.
   * async getContext() {
   *   const context = { username: this.discord.user.username }
   *  return { context }
   */
  abstract getContext(): Promise<State['context']> | State['context']

  /**
   * Validates the provided credentials.
   * @example: Discord validate credentials.
   * validateCredentials(credentials: Credentials) {
   * if (!credentials?.['discord-token']) {
   *  return false
   * }
   * @param credentials - The credentials to validate.
   * @returns The validated credentials or false if validation fails.
   */
  abstract validateCredentials(
    credentials: Credentials
  ): Credentials | false | Promise<Credentials | false>

  /**
   * Listens to an event.
   * @example: Discord listen.
   * listen(eventName: keyof DiscordEventPayload) {
   * this.discord.on(...)
   * }
   * @param eventName - The name of the event to listen to.
   */
  abstract listen(eventName: keyof Events): void | Promise<void>

  /**
   * Stops listening to an event.
   * @example: Discord unlisten.
   * unlisten(eventName: keyof DiscordEventPayload) {
   * this.discord.removeAllListeners(eventName)
   * }
   * @param eventName - The name of the event to stop listening to.
   */
  abstract unlisten(eventName: keyof Events): void | Promise<void>

  async beforeActivate() {
    await this.credentialsManager.update()
    const credentials = this.credentialsManager.getCredentials()
    const validated = await this.validateCredentials(
      credentials || ({} as Credentials)
    )
    if (!validated) {
      throw new Error(`${this.name} plugin has invalid credentials`)
    }
    await this.login(validated)
    if (!(await this.validateLogin())) {
      throw new Error(`${this.name} plugin failed to login`)
    }
    if (!(await this.validatePermissions())) {
      throw new Error(`${this.name} plugin has insufficient permissions`)
    }
  }

  async afterActivate() {
    this.listenAll()
  }

  beforeDeactivate() {
    this.unlistenAll()
  }

  async afterDeactivate(): Promise<void> {
    await this.logout()
  }

  beforeDestroy() {
    return this.beforeDeactivate()
  }

  afterDestroy() {}

  // COMMANDS

  handleEnableCommand() {
    this.activate()
  }

  handleDisableCommand() {
    this.deactivate()
  }

  handleLinkCommand() {
    this.activate()
  }

  handleUnlinkCommand() {
    this.deactivate()
  }

  handleWebhookCommand() {
    this.logger.info(
      'Webhook command received, but this plugin does not support webhooks'
    )
  }

  /**
   * Updates the plugin state with the new context.
   * Called automatically when the plugin is enabled.
   * @param context - The new context to set.
   */
  async updateContext() {
    const context = await this.getContext()
    // temp ignore until we move some of this down/up
    // @ts-ignore
    await this.updatePluginState({ context } as Partial<State>)
  }

  /**
   * Listens to all events.
   * Loops through the events defined in the plugin config and listens to them.
   */
  listenAll() {
    Object.keys(this.config.events).forEach(eventName => {
      this.listen(eventName)
    })
  }

  /**
   * Stops listening to all events.
   * Loops through the events defined in the plugin config and stops listening to them.
   */
  unlistenAll() {
    Object.keys(this.config.events).forEach(eventName => {
      this.unlisten(eventName)
    })
  }

  /**
   * Required method from parent class.
   * Defines events for the plugin.
   * Passed in events are defined in the plugin config and a type.
   */
  defineEvents() {
    for (const [messageType, eventName] of Object.entries(this.config.events)) {
      this.registerEvent({
        eventName,
        displayName: `${this.name} ${messageType}`,
      })
    }
  }

  /**
   * Required method from parent class.
   * Currently unused.
   */
  handleOnMessage() {}
}
