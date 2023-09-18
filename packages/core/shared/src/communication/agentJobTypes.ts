export const AGENT_RUN_JOB = (id: string) => `agent:run:${id}`
export const AGENT_COMMAND_JOB = (id: string) => `agent:command:${id}`
export const AGENT_UPDATE_JOB = (id: string) => `agent:update:${id}`
export const AGENT_DELETE_JOB = (id: string) => `agent:delete:${id}`

export interface CreateAgentJob {
  jobId: string
  agentId: string
}
