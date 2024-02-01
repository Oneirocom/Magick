import {
  GraphNodes,
  IGraph,
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
} from '@magickml/behave-graph'
import Redis from 'ioredis'
import { AgentLoggingService, type Agent } from 'server/agents'
import { EventStore } from './services/eventStore'
import { KeyvStateService } from './services/keyvStateService'

export class BaseRegistry {
  connection: Redis
  agent: Agent
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  graphNodes!: GraphNodes
  dependencies: Record<string, any> = {}

  constructor(agent: Agent, connection: Redis) {
    const stateService = new KeyvStateService(connection)
    this.connection = connection
    this.agent = agent
    this.dependencies.ILogger = new AgentLoggingService(agent)
    this.dependencies.IStateService = stateService
    this.dependencies.IEventStore = new EventStore(
      stateService,
      agent.app,
      agent.id
    )
  }

  init(graph: IGraph, graphNodes: GraphNodes) {
    this.dependencies.IEventStore.init(graphNodes)
    this.dependencies.IStateService.init(this.dependencies.IEventStore)
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
