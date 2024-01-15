import { createDbConnection, type PluginStateType } from './db'
import { handleError, ensureStateInitialized } from './utils'

export class PluginStateManager<T extends object = Record<string, unknown>> {
  private knex = createDbConnection()
  private plugin: string
  private agentId: string
  private currentState: PluginStateType<T> | undefined

  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
    this.initState()
  }

  private async initState(): Promise<void> {
    const stateRow = await this.knex('pluginState')
      .where({ agentId: this.agentId, plugin: this.plugin })
      .first()

    if (!stateRow) {
      const newState = {} as T
      await this.knex('pluginState').insert({
        agentId: this.agentId,
        plugin: this.plugin,
        state: JSON.stringify(newState),
      })

      this.currentState = newState
    } else {
      this.currentState = JSON.parse(stateRow.state) as T
    }
  }

  public async getPluginState(defaultState?: T): Promise<T> {
    await ensureStateInitialized(this.currentState, () => this.initState())
    return this.currentState || defaultState || ({} as T)
  }

  public async updatePluginState(newState: T): Promise<void> {
    try {
      await this.knex('pluginState')
        .where({ agentId: this.agentId, plugin: this.plugin })
        .update({ state: JSON.stringify(newState) })

      this.currentState = newState
    } catch (error: any) {
      handleError(error, 'Error updating plugin state')
    }
  }

  public async removePluginState(): Promise<void> {
    try {
      await this.knex('pluginState')
        .where({ agentId: this.agentId, plugin: this.plugin })
        .del()

      this.currentState = {} as T // Reset to empty state
    } catch (error: any) {
      handleError(error, 'Error removing plugin state')
    }
  }

  public getState(): T | undefined {
    return this.currentState
  }
}
