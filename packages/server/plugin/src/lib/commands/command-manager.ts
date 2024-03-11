export type PluginCommand = {
  commandName: string
  displayName: string
  handler: (enable: any) => void
}

export type PluginCommandInfo = Omit<PluginCommand, 'handler'>

export enum BaseCommands {
  enable = 'enable',
  disable = 'disable',
  linkCredential = 'linkCredential',
  unlinkCredential = 'unlinkCredential',
  webhook = 'webhook',
}

export const enableCommand: PluginCommandInfo = {
  commandName: BaseCommands.enable,
  displayName: 'Enable',
}

export const disableCommand: PluginCommandInfo = {
  commandName: BaseCommands.disable,
  displayName: 'Disable',
}

export const linkCredentialCommand: PluginCommandInfo = {
  commandName: BaseCommands.linkCredential,
  displayName: 'Link Credential',
}

export const unlinkCredentialCommand: PluginCommandInfo = {
  commandName: BaseCommands.unlinkCredential,
  displayName: 'Unlink Credential',
}

export const webhookCommand: PluginCommandInfo = {
  commandName: BaseCommands.webhook,
  displayName: 'Webhook',
}

export const basePluginCommands: Record<
  keyof typeof BaseCommands,
  PluginCommandInfo
> = {
  enable: enableCommand,
  disable: disableCommand,
  linkCredential: linkCredentialCommand,
  unlinkCredential: unlinkCredentialCommand,
  webhook: webhookCommand,
} as const

export abstract class PluginCommandManager {
  protected commands: PluginCommand[] = []

  /**
   * Registers a command with the plugin.
   * @param command The command definition to register.
   * @example
   * this.registerCommand({
   *   commandName: 'enable',
   *   displayName: 'Enable',
   *   handler: this.handleEnableCommand.bind(this)
   * });
   */
  abstract registerCommand(command: PluginCommand): void

  /**
   * Returns the list of registered commands.
   * @returns An array of PluginCommand objects.
   * @example
   * const commands = this.getCommands();
   */
  abstract getCommands(): Record<string, PluginCommand['handler']>
}

export class BaseCommandManager extends PluginCommandManager {
  registerCommand(command: PluginCommand) {
    this.commands.push(command)
  }

  getCommands(): Record<string, PluginCommand['handler']> {
    return this.commands.reduce((acc, command) => {
      acc[command.commandName] = command.handler
      return acc
    }, {} as Record<string, PluginCommand['handler']>)
  }
}
