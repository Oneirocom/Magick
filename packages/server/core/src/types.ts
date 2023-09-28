export interface AgentCommandData {
  agentId?: string
  projectId?: string
  command: string
  data: Record<string, any>
}
