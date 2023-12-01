import {
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
} from '@magickml/behave-graph'
import { coreEmitter } from './dependencies/coreEmitter'
import { MessageEvent } from './nodes/events/messageEvent'
import { AgentLoggingService, IAgentLogger } from 'server/agents'
export class BaseRegistry {
  values: ValueType[] = []
  nodes: NodeDefinition[] = [MessageEvent]
  dependencies: Record<string, any> = {
    core: coreEmitter,
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
