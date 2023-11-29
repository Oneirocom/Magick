export const AGENT_RUN_JOB = (id: string) => `agent:${id}:job:run`
export const AGENT_UPDATE_JOB = (id: string) => `agent:${id}:job:update`
export const AGENT_DELETE_JOB = (id: string) => `agent:${id}:job:delete`

export interface CreateAgentJob {
  jobId: string
  agentId: string
}
