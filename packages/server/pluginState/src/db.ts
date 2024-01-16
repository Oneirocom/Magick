import knex from 'knex'
import { DATABASE_URL } from 'packages/shared/config/src'

type PluginStateType<T extends object = Record<string, unknown>> = T

interface PluginState {
  agentId: string
  plugin: string
  state: string
}

const createDbConnection = () => {
  return knex<PluginState>({
    client: 'pg',
    connection: {
      connectionString: DATABASE_URL,
    },
    useNullAsDefault: true,
  })
}

export { createDbConnection, type PluginState, type PluginStateType }
