import { prismaCore } from '@magickml/server-db'

type PluginStateType<T extends object = Record<string, unknown>> = T

export const ensureStateInitialized = async <T extends object>(
  currentState: T | undefined,
  initState: () => Promise<void>
): Promise<T> => {
  if (!currentState) {
    await initState()
  }
  return currentState as T
}

export class PluginStateManager<T extends object = Record<string, unknown>> {
  private plugin: string
  private agentId: string
  private currentState: PluginStateType<T> | undefined

  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
    // this.initState()
  }

  private handleError(error: Error, message: string) {
    console.error(message, error)
    throw error
  }

  private async initState(): Promise<void> {
    const stateRow = await prismaCore.pluginState.findFirst({
      where: {
        agentId: this.agentId,
        plugin: this.plugin,
      },
    })

    if (!stateRow) {
      const newState = {} as T
      await prismaCore.pluginState.create({
        data: {
          agentId: this.agentId,
          plugin: this.plugin,
          state: newState,
        },
      })
      this.currentState = newState
    } else {
      this.currentState = stateRow.state as T
    }
  }

  private async ensureStateInitialized(): Promise<void> {
    if (this.currentState === undefined) {
      await this.initState()
    }
  }

  public async getPluginState(defaultState?: T): Promise<T> {
    await this.ensureStateInitialized()
    return this.currentState || defaultState || ({} as T)
  }

  public async updatePluginState(newState: T): Promise<void> {
    try {
      await prismaCore.pluginState.update({
        where: {
          agentId_plugin: {
            agentId: this.agentId,
            plugin: this.plugin,
          },
        },
        data: {
          state: newState,
        },
      })
      this.currentState = newState
    } catch (error: any) {
      this.handleError(error, 'Error updating plugin state')
    }
  }

  public async removePluginState(): Promise<void> {
    try {
      await prismaCore.pluginState.delete({
        where: {
          agentId_plugin: {
            agentId: this.agentId,
            plugin: this.plugin,
          },
        },
      })

      this.currentState = {} as T // Reset to empty state
    } catch (error: any) {
      this.handleError(error, 'Error removing plugin state')
    }
  }

  public getState(): T | undefined {
    return this.currentState
  }
}
