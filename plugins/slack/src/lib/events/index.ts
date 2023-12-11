export const ON_SLACK_MESSAGE = 'slackMessageReceived'

export const AGENT_SLACK_MESSAGE = (agentId: string) =>
  `agent:${agentId}:Slack:${ON_SLACK_MESSAGE}`
