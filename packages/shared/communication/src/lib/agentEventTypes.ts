import { ON_MESSAGE } from './coreEventTypes'

export const AGENT_RUN_ERROR = (agentId: string) => `agent:${agentId}:run:error`
export const AGENT_RUN_RESULT = (agentId: string) =>
  `agent:${agentId}:run:result`

export const AGENT_SPELL = (agentId: string) => `agent:${agentId}:server:spell`
export const AGENT_LOG = (agentId: string) => `agent:${agentId}:server:log`
export const AGENT_WARN = (agentId: string) => `agent:${agentId}:server:warn`
export const AGENT_ERROR = (agentId: string) => `agent:${agentId}:server:error`

export const AGENT_PONG = (agentId: string) => `agent:${agentId}:server:pong`

export const AGENT_SPELL_STATE = (agentId: string) =>
  `agent:${agentId}:server:spell`

export const AGENT_COMMAND = (agentId: string) =>
  `agent:${agentId}:event:command`

export const AGENT_COMMAND_PROJECT = (projectId: string) =>
  `agent:${projectId}:command`

export const AGENT_DELETE = `agent:delete`

// This cant be hardcodded
export const AGENT_MESSAGE = (agentId: string) =>
  `agent:${agentId}:Core:${ON_MESSAGE}`

// Messages for plugins
export const AGENT_PLUGIN_ENABLE = (agentId: string, pluginName: string) =>
  `agent:${agentId}:plugin:${pluginName}:enable`

export const AGENT_PLUGIN_DISABLE = (agentId: string, pluginName: string) =>
  `agent:${agentId}:plugin:${pluginName}:disable`

export const AGENT_PLUGIN_STATUS = (agentId: string, pluginName: string) =>
  `agent:${agentId}:plugin:${pluginName}:status`

export const AGENT_PLUGIN_RESET = (agentId: string, pluginName: string) =>
  `agent:${agentId}:plugin:${pluginName}:reset`

export const AGENT_PLUGIN_REFETCH_CREDENTIALS = (
  agentId: string,
  pluginName: string
) => `agent:${agentId}:plugin:${pluginName}:refetchCredentials`
