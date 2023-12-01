import { ILogger, LogSeverity } from '@magickml/behave-graph'

export interface IAgentLogger {
  log(text: string, data?: Record<string, any>): void
  warn(text: string, data?: Record<string, any>): void
  error(text: string, data?: Record<string, any>): void
}

export class AgentLoggingService<Agent extends IAgentLogger>
  implements ILogger
{
  private agent: Agent // Assuming Agent type is defined

  constructor(agent: Agent) {
    this.agent = agent
  }

  log(severity: LogSeverity, text: string, data = {}): void {
    switch (severity) {
      case 'verbose':
        // Handle verbose logging
        this.agent.log(text, data) // Assuming 'log' method handles verbose
        break
      case 'info':
        this.agent.log(text, data)
        break
      case 'warning':
        this.agent.warn(text, data)
        break
      case 'error':
        this.agent.error(text, data)
        break
      default:
        // Handle unknown severity or default case
        this.agent.log(text, data)
        break
    }
  }
}
