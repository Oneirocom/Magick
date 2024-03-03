import { EventEmitter } from 'events'
import {
  BasePluginInit,
  CoreEventsPlugin,
  EventPayload,
  basePluginCommands,
} from 'server/plugin'
import { PluginCredentialsType } from 'server/credentials'

/**
 * Defines the structure for WebSocketPlugin event names.
 */
interface WebSocketPluginEventNames {
  [key: string]: string
}

/**
 * Defines the structure for WebSocketPlugin actions.
 */
interface WebSocketPluginActions {
  [key: string]: string
}

/**
 * Defines the structure for WebSocketPlugin dependency keys.
 * These are the keys that the plugin will use to access dependencies.
 */
interface WebSocketPluginDepKeys {
  [key: string]: string
}

/**
 * Defines the structure for WebSocketPlugin State.
 * Does not extend PluginStateType but has same structure.
 */

export type WebSocketPluginState<T extends object = Record<string, unknown>> =
  T & {
    enabled: boolean
    context: Record<string, unknown>
  }

/**
 * Configuration object for WebSocketPlugin plugins.
 */
interface WSPluginConfig<
  Events extends WebSocketPluginEventNames,
  Actions extends WebSocketPluginActions,
  DependencyKeys extends WebSocketPluginDepKeys
> {
  events: Events
  actions: Actions
  dependencyKeys: DependencyKeys
  developerMode: boolean
}

/**
 * Abstract class for a WebSocket-based plugin.
 */
export abstract class WebSocketPlugin<
  WSEvents extends WebSocketPluginEventNames,
  WSActions extends WebSocketPluginActions,
  WSDepKeys extends WebSocketPluginDepKeys,
  CoreEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends WebSocketPluginState = WebSocketPluginState,
  Credentials extends PluginCredentialsType = PluginCredentialsType
> extends CoreEventsPlugin<
  CoreEvents,
  Payload,
  Data,
  Metadata,
  State,
  Credentials
> {
  protected pluginConfig: WSPluginConfig<WSEvents, WSActions, WSDepKeys>

  constructor({ name, connection, agentId, projectId }: BasePluginInit) {
    super({ name, connection, agentId, projectId })
    this.pluginConfig = this.getWSPluginConfig()
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
   * Abstract method to get the WebSocket plugin configuration.
   * This is a helper to avoid using the constructor.
   * @example: Discord plugin configuration.
   * @returns The WebSocket plugin configuration.
   */
  abstract getWSPluginConfig(): WSPluginConfig<WSEvents, WSActions, WSDepKeys>

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
  abstract validateCredentials(credentials: Credentials): Credentials | false

  /**
   * Listens to an event.
   * @example: Discord listen.
   * listen(eventName: keyof DiscordEventPayload) {
   * this.discord.on(...)
   * }
   * @param eventName - The name of the event to listen to.
   */
  abstract listen(eventName: keyof WSEvents): void | Promise<void>

  /**
   * Stops listening to an event.
   * @example: Discord unlisten.
   * unlisten(eventName: keyof DiscordEventPayload) {
   * this.discord.removeAllListeners(eventName)
   * }
   * @param eventName - The name of the event to stop listening to.
   */
  abstract unlisten(eventName: keyof WSEvents): void | Promise<void>

  /**
   * Handles plugin enabling.
   * Updates the plugin enabled state and initializes functionalities.
   */
  async handleEnable() {
    await this.updatePluginState({ enabled: true } as State)
    await this.initializeFunctionalities()
    this.logger.debug('Plugin enabled')
  }

  /**
   * Handles plugin disabling.
   * Updates the plugin enabled state and logs out.
   */
  async handleDisable() {
    await this.updatePluginState({ enabled: false } as State)
    await this.logout()
    this.logger.debug('Plugin disabled')
  }

  /**
   * Updates the plugin state with the new context.
   * Called automatically when the plugin is enabled.
   * @param context - The new context to set.
   */
  async updateContext() {
    const context = await this.getContext()
    await this.updatePluginState({ context } as Partial<State>)
  }

  /**
   * Listens to all events.
   * Loops through the events defined in the plugin config and listens to them.
   */
  listenAll() {
    Object.keys(this.pluginConfig.events).forEach(eventName => {
      this.listen(eventName)
    })
  }

  /**
   * Stops listening to all events.
   * Loops through the events defined in the plugin config and stops listening to them.
   */
  unlistenAll() {
    Object.keys(this.pluginConfig.events).forEach(eventName => {
      this.unlisten(eventName)
    })
  }

  /**
   * Required method from parent class.
   * Initializes the plugin functionalities.
   * This method is called automatically when the plugin is enabled.
   * It checks if it should be enabled and if the credentials are valid.
   * If so, it initializes the WebSocket functionalities.
   * If not, it logs a warning and disables the plugin.
   */
  async initializeFunctionalities() {
    const state = await this.stateManager.getPluginState()
    await this.updateCredentials()

    console.log(`Initializing ${this.name} plugin... ${state}`)

    if (state?.enabled) {
      const credentials = await this.getCredentials()
      const validated = this.validateCredentials(
        credentials || ({} as Credentials)
      )
      if (!validated) {
        this.logger.warn(
          `${this.name} plugin is disabled due to invalid credentials`
        )
        await this.updatePluginState({ enabled: false } as State)
      } else {
        this.logger.info(`Initializing ${this.name} plugin...`)
        await this.login(validated)

        // Validate login
        if (!(await this.validateLogin())) {
          this.logger.warn(
            `${this.name} plugin is disabled due to failed login`
          )
          await this.updatePluginState({ enabled: false } as State)
        }

        // Validate permissions
        if (!(await this.validatePermissions())) {
          this.logger.warn(
            `${this.name} plugin is disabled due to failed permissions`
          )
          await this.updatePluginState({ enabled: false } as State)
        }

        await this.updateContext()
        await this.initializeWebSocketFunctionalities()
      }
    } else {
      this.logger.warn(
        `${this.name} plugin is disabled but we tried to initialize it`
      )
    }
  }

  /**
   * Initializes WebSocket functionalities.
   * By default were just listening to all events.
   * Override this method to customize this behavoir.
   * It could make a nice pairing with state and commands to let users enable/disable events.
   * It would also lower processing usage to not listen to all by default.
   */
  async initializeWebSocketFunctionalities() {
    this.logger.info('Initializing WebSocket functionalities')
    this.listenAll()
    // THIS USED TO BE IN THE OLD DISCORD PLUGIN
    // TODO: Figure out how to handle this
    // I was having a double send issue so I commented this out for now
    // it also belongs somewhere else now
    // this.discord?.onMessageCreate(event => {
    //   console.log('onMessageCreate', event)
    //   // todo fix typing here,but I am lazy.
    //   this.triggerMessageReceived(event as any)
    // })
  }

  /**
   * Required method from parent class.
   * Defines commands for the plugin.
   * Setup the enable/disable and linkCredential/unlinkCredential commands.
   * Override this method to add more commands but be sure define enable/disable.
   */
  defineCommands() {
    const { enable, disable, linkCredential, unlinkCredential } =
      basePluginCommands
    this.registerCommand({
      ...linkCredential,
      handler: this.handleEnable.bind(this),
    })
    this.registerCommand({
      ...unlinkCredential,
      handler: this.handleDisable.bind(this),
    })
    this.registerCommand({ ...enable, handler: this.handleEnable.bind(this) })
    this.registerCommand({ ...disable, handler: this.handleDisable.bind(this) })
  }

  /**
   * Required method from parent class.
   * Defines events for the plugin.
   * Passed in events are defined in the plugin config and a type.
   */
  defineEvents() {
    for (const [messageType, eventName] of Object.entries(
      this.pluginConfig.events
    )) {
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
