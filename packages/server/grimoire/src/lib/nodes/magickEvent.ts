import {
  EventNodeInstance,
  IEventNodeDefinition,
  INodeDefinition,
  NodeConfigurationDescription,
  NodeType,
  SocketsDefinition,
  makeCommonProps,
} from '@magickml/behave-graph'

type OmitFactoryAndType<T extends INodeDefinition> = Omit<
  T,
  'nodeFactory' | 'nodeType'
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

export function makeMagickEventNodeDefinition<
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TConfig extends NodeConfigurationDescription,
  TState
>(
  definition: OmitFactoryAndType<
    IEventNodeDefinition<TInput, TOutput, TConfig, TState>
  >
): IEventNodeDefinition<TInput, TOutput, TConfig, TState> {
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
        init: definition.init,
        dispose: definition.dispose,
      }),
  }
}
