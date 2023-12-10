import {
  IGraph,
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
} from '@magickml/behave-graph'
import Redis from 'ioredis'
import { AgentLoggingService, IAgentLogger } from 'server/agents'
import { EventStore } from './services/eventStore'
import { KeyvStateService } from './services/keyvStateService'

export class BaseRegistry {
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  dependencies: Record<string, any> = {
    ILifecycleEventEmitter: new ManualLifecycleEventEmitter(),
    IEventStore: new EventStore(),
  }

  constructor(agent: IAgentLogger, connection: Redis) {
    // Create the agent logger for the core registry
    this.dependencies.IStateService = new KeyvStateService(connection)
    this.dependencies.ILogger = new AgentLoggingService(agent)
  }

  init(graph: IGraph) {
    this.dependencies.IStateService.init(graph)
  }

  getRegistry(): IRegistry {
    return {
      values: {},
      nodes: {},
      dependencies: this.dependencies,
    }
  }
}
