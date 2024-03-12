export type PluginStateType<T extends object = Record<string, unknown>> = T & {
  enabled: boolean
}

export abstract class PluginStateManager<T extends object = Record<string, unknown>> {
  protected plugin: string
  protected agentId: string
  protected currentState: PluginStateType<T> | undefined

  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
  }

  protected abstract handleError(error: Error, message: string): void
  protected abstract initState(
    defaultState: PluginStateType<T>
  ): Promise<PluginStateType<T> | undefined>

  abstract ensureStateInitialized(
    defaultState: PluginStateType<T>
  ): Promise<PluginStateType<T> | undefined>
  abstract getPluginState(): Promise<PluginStateType<T> | undefined>
  abstract updatePluginState(
    newState: Partial<PluginStateType<T>>
  ): Promise<PluginStateType<T> | undefined>
  abstract removePluginState(): Promise<void>
  abstract getGlobalState(
    name?: string
  ): Promise<Record<string, PluginStateType<T>>>
  abstract getState(): PluginStateType<T> | undefined
}
