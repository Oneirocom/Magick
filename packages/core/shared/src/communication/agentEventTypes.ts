export const AGENT_RUN_ERROR = (agentId: string) => `agent:${agentId}:run:error`
export const AGENT_RUN_RESULT = (agentId: string) =>
  `agent:${agentId}:run:result`
export const AGENT_SPELL = (agentId: string) => `agent:${agentId}:spell`
export const AGENT_LOG = (agentId: string) => `agent:${agentId}:log`
export const AGENT_WARN = (agentId: string) => `agent:${agentId}:warn`
export const AGENT_ERROR = (agentId: string) => `agent:${agentId}:error`
export const AGENT_COMMAND = (agentId: string) => `agent:${agentId}:command`
export const AGENT_COMMAND_PROJECT = (projectId: string) =>
  `agent:${projectId}:command`
export const AGENT_DELETE = `agent:delete`
