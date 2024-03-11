import { BasePlugin, BasePluginInit } from '../basePlugin'
import { EventPayload } from '../events/event-manager'

export abstract class WebSocketPlugin<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>,
  Credentials extends Record<string, string | undefined>,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends object = Record<string, unknown>
> extends BasePlugin<
  Events,
  Actions,
  Dependencies,
  Commands,
  Credentials,
  Payload,
  Data,
  Metadata,
  State
> {
  constructor({ name, connection, agentId, projectId }: BasePluginInit) {
    super({ name, connection, agentId, projectId })
  }

  abstract login(credentials: Credentials): Promise<void>

  abstract validateLogin(): boolean | Promise<boolean>

  abstract validatePermissions(): boolean | Promise<boolean>

  abstract validateCredentials(
    credentials: Credentials
  ): Credentials | false | Promise<Credentials | false>

  abstract logout(): Promise<void>

  abstract listen(eventName: keyof Events): void | Promise<void>

  abstract unlisten(eventName: keyof Events): void | Promise<void>

  listenAll() {
    Object.keys(this.config.events).forEach(eventName => {
      this.listen(eventName)
    })
  }

  unlistenAll() {
    Object.keys(this.config.events).forEach(eventName => {
      this.unlisten(eventName)
    })
  }

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
    await this.listenAll()
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
}
