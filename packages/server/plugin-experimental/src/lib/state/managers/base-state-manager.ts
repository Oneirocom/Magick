import { prismaCore } from '@magickml/server-db'
import { v4 } from 'uuid'
import { PluginStateManager, PluginStateType } from '../plugin-state-manager'

export class BasePluginStateManager<
  T extends object = Record<string, unknown>
> extends PluginStateManager<T> {
  protected handleError(error: Error, message: string) {
    console.error(message, error)
    throw error
  }

  protected async initState(defaultState: PluginStateType<T>) {
    const stateRow = await prismaCore.pluginState.findFirst({
      where: {
        agentId: this.agentId,
        plugin: this.plugin,
      },
    })

    if (!stateRow) {
      const newState = await prismaCore.pluginState.create({
        data: {
          agentId: this.agentId,
          plugin: this.plugin,
          state: defaultState,
        },
      })
      if (!newState) {
        throw new Error('Error initializing plugin state')
      } else {
        this.currentState = newState.state as PluginStateType<T>
      }
    } else {
      this.currentState = stateRow.state as PluginStateType<T>
    }
    return this.currentState
  }

  async ensureStateInitialized(defaultState: PluginStateType<T>) {
    if (this.currentState === undefined) {
      await this.initState(defaultState)
    }
    return this.currentState
  }

  async getPluginState() {
    return this.currentState
  }

  async updatePluginState(newState: Partial<PluginStateType<T>>) {
    try {
      const updatedState = await prismaCore.pluginState.upsert({
        where: {
          agentId_plugin: {
            agentId: this.agentId,
            plugin: this.plugin,
          },
        },
        update: {
          state: {
            ...this.currentState,
            ...newState,
          },
        },
        create: {
          agentId: this.agentId,
          plugin: this.plugin,
          state: {
            ...this.currentState,
            ...newState,
          },
        },
      })
      this.currentState = updatedState.state as PluginStateType<T>
      return this.currentState
    } catch (error: any) {
      console.error('Error updating plugin state', error)
      return this.currentState
    }
  }

  async removePluginState(): Promise<void> {
    try {
      await prismaCore.pluginState.delete({
        where: {
          agentId_plugin: {
            agentId: this.agentId,
            plugin: this.plugin,
          },
        },
      })
      this.currentState = { enabled: false } as PluginStateType<T>
    } catch (error: any) {
      this.handleError(error, 'Error removing plugin state')
    }
  }

  async getGlobalState(
    name?: string
  ): Promise<Record<string, PluginStateType<T>>> {
    try {
      const pluginStates = await prismaCore.pluginState.findMany({
        where: {
          agentId: this.agentId,
          ...(name && { plugin: name }),
        },
      })

      return pluginStates.reduce((acc, state) => {
        acc[state?.plugin ?? v4()] = state.state as PluginStateType<T>
        return acc
      }, {} as Record<string, PluginStateType<T>>)
    } catch (error: any) {
      this.handleError(error, 'Error getting agent plugin states')
    }

    return {} as Record<string, PluginStateType<T>>
  }

  getState(): PluginStateType<T> | undefined {
    return this.currentState
  }
}
