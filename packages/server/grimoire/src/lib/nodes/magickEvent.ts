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

type OmitFactoryAndType<T extends INodeDefinition> = Omit<
  T,
  'nodeFactory' | 'nodeType' | 'init' | 'dispose' | 'definition'
>

interface ExtendedConfig extends NodeConfigurationDescription {
  eventState: {
    valueType: string
    defaultValue: string
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
      valueType: 'string',
      defaultValue: 'channel',
    },
    eventStateProperties: {
      valueType: 'array',
      defaultValue: ['channel'],
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
