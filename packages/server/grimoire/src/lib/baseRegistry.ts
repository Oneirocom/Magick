import {
  IGraph,
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
} from '@magickml/behave-graph'
import { AgentLoggingService, IAgentLogger } from 'server/agents'
import { DefaultStateService } from './services/defaultStateService'
import { EventStore } from './services/eventStore'

export class BaseRegistry {
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  dependencies: Record<string, any> = {
    ILifecycleEventEmitter: new ManualLifecycleEventEmitter(),
    IEventStore: new EventStore(),
  }

  constructor(agent: IAgentLogger) {
    // Create the agent logger for the core registry
    this.dependencies.IStateServive = new DefaultStateService()
    this.dependencies.ILogger = new AgentLoggingService(agent)
  }

  init(graph: IGraph) {
    this.dependencies.IStateServive.init(graph)
  }

  getRegistry(): IRegistry {
    return {
      values: {},
      nodes: {},
      dependencies: this.dependencies,
    }
  }
}
