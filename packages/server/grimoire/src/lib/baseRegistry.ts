import {
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
} from '@magickml/behave-graph'
import { AgentLoggingService, IAgentLogger } from 'server/agents'
export class BaseRegistry {
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  dependencies: Record<string, any> = {
    ILifecycleEventEmitter: new ManualLifecycleEventEmitter(),
  }

  constructor(agent: IAgentLogger) {
    // Create the agent logger for the core registry
    this.dependencies.ILogger = new AgentLoggingService(agent)
  }

  getRegistry(): IRegistry {
    return {
      values: {},
      nodes: {},
      dependencies: this.dependencies,
    }
  }
}
