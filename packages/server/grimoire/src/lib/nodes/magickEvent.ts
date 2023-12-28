import {
  EventNodeInstance,
  EventNodeSetupParams,
  IEventNodeDefinition,
  INodeDefinition,
  NodeConfigurationDescription,
  NodeType,
  SocketsDefinition,
  makeCommonProps,
} from '@magickml/behave-graph'
import { BaseEmitter, EventPayload } from 'server/plugin'
import { IEventStore } from '../services/eventStore'

type OmitFactoryAndType<T extends INodeDefinition> = Omit<
  T,
  'nodeFactory' | 'nodeType' | 'init' | 'dispose' | 'definition'
>

interface ExtendedConfig extends NodeConfigurationDescription {
  eventState: {
    valueType: string
    defaultValue: string[]
  }
  eventStateProperties: {
    valueType: string
    defaultValue: string[]
  }
  hiddenProperties: {
    valueType: string
    defaultValue: string[]
  }
}

type CustomEventNodeConfig<
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TState
> = {
  handleEvent: (
    event: EventPayload,
    args: EventNodeSetupParams<TInput, TOutput, TState>
  ) => void // Define the type more precisely if possible
  dependencyName: string
  eventName: string
}

export function makeMagickEventNodeDefinition<
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TConfig extends NodeConfigurationDescription,
  TState
>(
  definition: OmitFactoryAndType<
    IEventNodeDefinition<TInput, TOutput, TConfig, TState>
  >,
  eventConfig: CustomEventNodeConfig<TInput, TOutput, TState>
): Omit<
  IEventNodeDefinition<TInput, TOutput, TConfig, TState>,
  'init' | 'dispose'
> {
  definition.configuration = {
    ...definition.configuration,
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'eventState'],
    },
    eventState: {
      valueType: 'array',
      defaultValue: [] as string[],
    },
    eventStateProperties: {
      valueType: 'array',
      defaultValue: ['connector', 'client', 'channel', 'agentId', 'sender'],
    },
  } as TConfig & ExtendedConfig

  return {
    ...definition,
    nodeFactory: (graph, config, id) =>
      new EventNodeInstance({
        ...makeCommonProps(NodeType.Event, definition, config, graph, id),
        initialState: definition.initialState,
        init: args => {
          const {
            node,
            engine,
            graph: { getDependency },
          } = args

          // Using the config object
          const onStartEvent = (event: EventPayload) => {
            // attach event key to the event here
            // we set the current event in the event store for access in the state
            const eventStore = getDependency<IEventStore>('IEventStore')
            const eventState = node?.configuration.eventState

            // set the event key  by sorting the event state properties alphabetically and then joining them
            // warning: if we change this key, all agents will lose access to their state
            debugger
            const stateKey = eventState.sort().reduce((acc, key) => {
              const property = event[key]
              if (property === undefined) return acc

              // only add the : if there is already a key
              if (acc.length > 0) {
                acc = `${acc}:${property}`
              } else {
                acc = `${property}`
              }

              return acc
            }, '')

            const eventWithKey = {
              ...event,
              stateKey,
            }

            eventStore?.setEvent(eventWithKey)

            eventConfig.handleEvent(event, args) // Pass all init args and the event to the callback
            if (!node || !engine) return
            engine.onNodeExecutionEnd.emit(node)
          }

          // todo we should hard type this base emitter better
          const customEventEmitter = getDependency<BaseEmitter>(
            eventConfig.dependencyName
          )
          customEventEmitter?.on(eventConfig.eventName, onStartEvent)

          return {
            onStartEvent,
          }
        },
        dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
          // ... existing dispose setup ...
          const customEventEmitter = getDependency<BaseEmitter>(
            config.dependencyName
          )
          if (onStartEvent)
            customEventEmitter?.removeListener(config.eventName, onStartEvent)
          return {}
        },
      }),
  }
}
