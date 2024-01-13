import {
  GraphNodes,
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
  connection: Redis
  agent: IAgentLogger
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  graphNodes!: GraphNodes
  dependencies: Record<string, any> = {}

  constructor(agent: IAgentLogger, connection: Redis) {
    this.connection = connection
    this.agent = agent
    this.dependencies.ILogger = new AgentLoggingService(agent)
    this.dependencies.IEventStore = new EventStore()
    this.dependencies.IStateService = new KeyvStateService(connection)
  }

  init(graph: IGraph, graphNodes: GraphNodes) {
    this.dependencies.IStateService.init(graph)
    this.dependencies.IEventStore.init(graph, graphNodes)
  }

  getDependencies(): Record<string, any> {
    return {
      ...this.dependencies,
      ILifecycleEventEmitter: new ManualLifecycleEventEmitter(),
      ILogger: new AgentLoggingService(this.agent),
    }
  }

  getRegistry(): IRegistry {
    return {
      values: {},
      nodes: {},
      dependencies: this.getDependencies(),
    }
  }
}
