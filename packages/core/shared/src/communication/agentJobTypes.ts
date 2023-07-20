export const AGENT_RUN_JOB = (id: string) => `agent:run:${id}`

export interface CreateAgentJob {
    jobId: string
    agentId: string
}
