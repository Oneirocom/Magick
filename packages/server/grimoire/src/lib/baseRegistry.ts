import {
  GraphNodes,
  IGraph,
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
  memo,
} from '@magickml/behave-graph'
import Redis from 'ioredis'
import { AgentLoggingService, type Agent } from 'server/agents'
import { EventStore } from './services/eventStore'
import { KeyvStateService } from './services/keyvStateService'
import { EventPayload } from 'server/plugin'
import { SpellCaster } from './spellCaster'
import { runSubspell } from './nodes/subspells/subspell'
import { BASE_DEP_KEYS } from './constants'
import { SubspellInput } from './nodes/subspells/subspellInput'
import { SubspellOutput } from './nodes/subspells/subspellOutput'

const nodes = [runSubspell, SubspellInput, SubspellOutput]

const getPluginNodes = (nodes: NodeDefinition[]) => {
  const nodeDefinitions = nodes

  if (!nodeDefinitions) return {}

  return Object.fromEntries(
    nodeDefinitions.map((nodeDefinition: NodeDefinition) => [
      nodeDefinition.typeName,
      nodeDefinition,
    ])
  )
}

export class BaseRegistry {
  connection: Redis
  agent: Agent
  values: ValueType[] = []
  nodes: NodeDefinition[] = nodes
  graphNodes!: GraphNodes
  dependencies: Record<string, any> = {}
  spellCaster: SpellCaster

  constructor(agent: Agent, connection: Redis, spellCaster: SpellCaster) {
    const stateService = new KeyvStateService(connection)
    this.connection = connection
    this.spellCaster = spellCaster
    this.agent = agent
    this.dependencies.ILogger = new AgentLoggingService(agent)
    this.dependencies.IStateService = stateService
    this.dependencies.IEventStore = new EventStore(
      stateService,
      agent.app,
      agent.id
    )

    this.dependencies.IEventStore.on('done', (event: EventPayload) => {
      if (event) {
        this.agent.emit('eventComplete', event)
      }
    })
  }

  init(graph: IGraph, graphNodes: GraphNodes) {
    this.dependencies.IEventStore.init(graphNodes)
    this.dependencies.IStateService.init(this.dependencies.IEventStore)
  }

  protected getPluginNodes = memo<Record<string, NodeDefinition>>(() => {
    const nodeDefinitions = this.nodes

    if (!nodeDefinitions) return {}

    return Object.fromEntries(
      nodeDefinitions.map(nodeDefinition => [
        nodeDefinition.typeName,
        nodeDefinition,
      ])
    )
  })

  getDependencies(): Record<string, any> {
    return {
      ...this.dependencies,
      [BASE_DEP_KEYS.I_LIFECYCLE_EMITTER]: new ManualLifecycleEventEmitter(),
      [BASE_DEP_KEYS.I_LOGGER]: new AgentLoggingService(this.agent),
      [BASE_DEP_KEYS.I_SPELLCASTER]: this.spellCaster,
    }
  }

  getRegistry(): IRegistry {
    return {
      values: {},
      nodes: this.getPluginNodes(),
      dependencies: this.getDependencies(),
    }
  }
}

export function getBaseregistryNodeSpecs(): IRegistry {
  return {
    values: {},
    dependencies: {},
    nodes: getPluginNodes(nodes),
  }
}
