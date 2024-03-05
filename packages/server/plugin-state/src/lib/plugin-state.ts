import { prismaCore } from '@magickml/server-db'
import { v4 } from 'uuid'

// Defines the structure for the plugin state, extending it with a mandatory enabled flag.
export type PluginStateType<T extends object = Record<string, unknown>> = T & {
  enabled: boolean
}

// Manages the state of a plugin, including its initialization, retrieval, update, and removal.
export class PluginStateManager<T extends object = Record<string, unknown>> {
  private plugin: string
  private agentId: string
  private currentState: PluginStateType<T> | undefined

  // Initializes the manager with an agent ID and plugin name.
  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
  }

  // Handles errors by logging and rethrowing them.
  private handleError(error: Error, message: string) {
    console.error(message, error)
    throw error
  }

  // Initializes the plugin state in the database if not already present.
  private async initState(defaultState: PluginStateType<T>) {
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

  // Ensures the plugin state is initialized before any operation.
  public async ensureStateInitialized(defaultState: PluginStateType<T>) {
    if (this.currentState === undefined) {
      await this.initState(defaultState)
    }
    return this.currentState
  }

  // Retrieves the current plugin state, initializing it if necessary.
  public async getPluginState() {
    return this.currentState
  }

  // Updates the plugin state in the database.
  public async updatePluginState(newState: Partial<PluginStateType<T>>) {
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

  // Removes the plugin state from the database, resetting to a default state.
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
      this.currentState = { enabled: false } as PluginStateType<T>
    } catch (error: any) {
      this.handleError(error, 'Error removing plugin state')
    }
  }

  // Gets the state of all plugins for the current agent.
  public async getGlobalState(
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

  // Returns the current state of the plugin.
  public getState(): PluginStateType<T> | undefined {
    return this.currentState
  }
}
