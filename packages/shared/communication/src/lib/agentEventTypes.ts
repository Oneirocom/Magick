import { ON_MESSAGE } from './coreEventTypes'

export const AGENT_RUN_ERROR = (agentId: string) => `agent:${agentId}:run:error`
export const AGENT_RUN_RESULT = (agentId: string) =>
  `agent:${agentId}:run:result`

export const AGENT_SPELL = (agentId: string) => `agent:${agentId}:server:spell`
export const AGENT_LOG = (agentId: string) => `agent:${agentId}:server:log`
export const AGENT_WARN = (agentId: string) => `agent:${agentId}:server:warn`
export const AGENT_ERROR = (agentId: string) => `agent:${agentId}:server:error`
export const AGENT_EVENT = (agentId: string) => `agent:${agentId}:server:event`

export const AGENT_PONG = (agentId: string) => `agent:${agentId}:server:pong`

export const AGENT_SPELL_STATE = (agentId: string) =>
  `agent:${agentId}:server:spell`

export const AGENT_COMMAND = (agentId: string) =>
  `agent:${agentId}:action:command`

export const AGENT_COMMAND_PROJECT = (projectId: string) =>
  `agent:${projectId}:action:command`

export const AGENT_DELETE = `agent:delete`

// This cant be hardcodded
export const AGENT_MESSAGE = (agentId: string) =>
  `agent:${agentId}:Core:${ON_MESSAGE}`

export const AGENT_PLUGIN_REFETCH_CREDENTIALS = (
  agentId: string,
  pluginName: string
) => `agent:${agentId}:plugin:${pluginName}:refetchCredentials`
