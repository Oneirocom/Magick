import Redis from 'ioredis'
import { NodeDefinition, ValueType } from '@magickml/behave-graph'
import { PluginCredential } from 'server/credentials'
import { SpellCaster } from 'server/grimoire'
import { BasePlugin } from './basePlugin'

import { BasePluginConfig, BasePluginCredentials } from './types'

import { PluginStateType } from './state'

import { EventPayload } from './events/event-manager'
import { ActionPayload } from './actions/action-manager'
import { CreateCredentialsRecord } from './credentials'

enum events {
  testRecieved = 'Test Recieved',
}

enum actions {
  sendTest = 'Send Test',
}

enum dependencies {
  testDependency = 'testDependency',
}

enum commands {
  testCommand = 'Test Command',
}

const pluginName = 'TestPlugin' as const

export const credentials = [
  {
    name: 'discord-token',
    serviceType: 'discord',
    credentialType: 'plugin',
    initials: 'DC',
    clientName: 'Discord Token',
    icon: 'https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg',
    helpLink: 'https://discord.com/developers/applications',
    description: 'Used to connect to Discord',
    available: true,
    pluginName: pluginName,
  },
] as const satisfies ReadonlyArray<PluginCredential>

export type Credentials = CreateCredentialsRecord<typeof credentials>

interface TestPluginState {
  context: Record<string, unknown>
  someState: string
}

class TestPlugin extends BasePlugin<
  typeof events,
  typeof actions,
  typeof dependencies,
  typeof commands,
  Credentials,
  EventPayload,
  Record<string, unknown>,
  Record<string, unknown>,
  TestPluginState
> {
  nodes: NodeDefinition[] = []
  values: ValueType[] = []
  defaultState: PluginStateType<TestPluginState> = {
    enabled: false,
    context: {},
    someState: 'initial',
  }

  constructor(agentId: string, connection: Redis, projectId: string) {
    super({ name: pluginName, agentId, connection, projectId })
  }

  getPluginConfig(): BasePluginConfig<
    typeof events,
    typeof actions,
    typeof dependencies,
    typeof commands
  > {
    return {
      events,
      actions,
      dependencyKeys: dependencies,
      commands,
      developerMode: true,
      credentials,
    }
  }

  async test() {
    const state = await this.stateManager.getPluginState() // good
    const creds = await this.credentialsManager.getCredentials() // goood
  }

  getActionHandlers() {
    return {
      sendTest: this.handleTestAction,
    }
  }

  handleTestAction(payload: ActionPayload) {
    console.log('Handling test action:', payload)
  }

  getCommandHandlers() {
    return {
      testCommand: this.handleEnableCommand.bind(this),
    }
  }

  handleTestCommand() {
    console.log('Handling test command')
  }

  handleEnableCommand() {
    console.log('Handling enable command')
  }

  handleDisableCommand() {
    console.log('Handling disable command')
  }

  handleLinkCommand() {
    console.log('Handling link command')
  }

  handleUnlinkCommand() {
    console.log('Handling unlink command')
  }

  handleWebhookCommand() {
    console.log('Handling webhook command')
  }

  initializeFunctionalities(): Promise<void> | void {
    console.log('Initializing functionalities')
  }

  beforeActivate(): Promise<void> | void {
    console.log('Before activate')
  }

  afterActivate(): Promise<void> | void {
    console.log('After activate')
  }

  beforeDeactivate(): Promise<void> | void {
    console.log('Before deactivate')
  }

  afterDeactivate(): Promise<void> | void {
    console.log('After deactivate')
  }

  beforeDestroy(): void {
    console.log('Before destroy')
  }

  afterDestroy(): void {
    console.log('After destroy')
  }

  getDependencies(spellCaster: SpellCaster) {
    return {
      testDependency: console.log('Getting test dependency'),
    }
  }

  formatPayload(
    event: string,
    details: Partial<EventPayload>
  ): EventPayload<Record<string, unknown>, Record<string, unknown>> {
    return {
      ...details,
      plugin: pluginName,
      connector: pluginName,
      eventName: event,
      timestamp: new Date().toISOString(),
    } as EventPayload<Record<string, unknown>, Record<string, unknown>>
  }
}
