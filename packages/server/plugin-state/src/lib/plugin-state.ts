import { prismaCore } from '@magickml/server-db'

export type PluginStateType<T extends object = Record<string, unknown>> = T & {
  enabled: boolean
}

export class PluginStateManager<T extends object = Record<string, unknown>> {
  private plugin: string
  private agentId: string
  private currentState: PluginStateType<T> | undefined

  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
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
      // Ensure the newState object conforms to PluginStateType<T>
      const newState: PluginStateType<T> = {
        enabled: false,
      } as PluginStateType<T>
      await prismaCore.pluginState.create({
        data: {
          agentId: this.agentId,
          plugin: this.plugin,
          state: newState,
        },
      })
      this.currentState = newState
    } else {
      this.currentState = stateRow.state as PluginStateType<T>
    }
  }

  private async ensureStateInitialized(): Promise<void> {
    if (this.currentState === undefined) {
      await this.initState()
    }
  }

  public async getPluginState(
    defaultState?: PluginStateType<T>
  ): Promise<PluginStateType<T>> {
    await this.ensureStateInitialized()
    return (
      this.currentState ||
      defaultState ||
      ({ enabled: false } as PluginStateType<T>)
    )
  }

  public async updatePluginState(newState: PluginStateType<T>): Promise<void> {
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

      // Reset to a valid empty state conforming to PluginStateType<T>
      this.currentState = { enabled: false } as PluginStateType<T>
    } catch (error: any) {
      this.handleError(error, 'Error removing plugin state')
    }
  }

  public getState(): PluginStateType<T> | undefined {
    return this.currentState
  }
}
