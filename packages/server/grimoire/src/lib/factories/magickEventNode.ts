import {
  EventNodeInstance,
  EventNodeSetupParams,
  IEventNodeDefinition,
  IGraph,
  INodeDefinition,
  NodeConfigurationDescription,
  NodeType,
  SocketsDefinition,
  StateReturn,
  makeCommonProps,
} from '@magickml/behave-graph'
import { BaseEmitter } from 'server/plugin'
import { EventPayload, CORE_DEP_KEYS } from 'servicesShared'
import { IEventStore } from '../services/eventStore'
import { getEventStateKey } from '../utils'

type OmitFactoryAndType<T extends INodeDefinition> = Omit<
  T,
  'nodeFactory' | 'nodeType' | 'init' | 'dispose' | 'definition'
>

// This is the extended configuration for the event node.
// We add a number of new configuration properties to the event node.
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

type DisposeCallback<TState = any> = {
  graph: IGraph
  state: TState
}

export type CustomEventNodeConfig<
  TEventPayload extends EventPayload,
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TState = any
> = {
  handleEvent?: (
    event: TEventPayload,
    args: EventNodeSetupParams<TInput, TOutput, TState>
  ) => void // Define the type more precisely if possible
  dependencyName?: string
  eventName?: string
  init?: (
    args: EventNodeSetupParams<TInput, TOutput, TState> & {
      handleState: (event: TEventPayload, storeEvent?: boolean) => void
      finish: () => void
    }
  ) => StateReturn<TState> | undefined
  customListener?: (
    getDependency: IGraph['getDependency'],
    onStartEvent: (event: TEventPayload) => void
  ) => void
  dispose?: (args: DisposeCallback<TState>) => Record<string, unknown>
}

/**
 * The makeMagickEventNodeDefinition function is a factory function that creates a new event node definition
 * We use this for all magick events going into our system  This allows us to define the event configuration
 * in one place and then use it to create the node definition.
 *
 * We have a number of modifications to the core event node definition:
 *
 * We add a new configuration property called eventState.  This is an array of strings that represent the
 * properties of the event that we want to use to create the state key.  The state key is used to store the
 * state for the event.  We use this to ensure that the state is matched to the correct event.  If we don't
 * do this, then the state will be matched to the last event that was processed by the engine.  This is a
 * problem when we have multiple events running on the same engine.
 *
 * Each event that comes in is marked with a unique key.  This key is used in many places to ensure that the
 * engine is tracking state just for that event, since multiple engines could be processing subsequent events
 * coming in.
 *
 * We also have added custom modifications to the commit function.  We use this to sync the state at the end of
 * the event and clear the state cache.  This ensures that the state is synced to the correct event and that the
 * state cache is cleared for the next event.
 *
 * Similarly, when the event comes in, we rehydrate the state for the graph.  This loads up any state from the
 * last run of this event on this or another engine. This allows the state for the duration of the run to be
 * synchronous and we deal with the asynchronous state syncing to the service at the end of the event.
 *
 * @param definition The base node definition
 * @param eventConfig The event configuration
 * @returns A new event node definition
 */
export function makeMagickEventNodeDefinition<
  TEventPayload extends EventPayload = EventPayload,
  TInput extends SocketsDefinition = SocketsDefinition,
  TOutput extends SocketsDefinition = SocketsDefinition,
  TConfig extends NodeConfigurationDescription = NodeConfigurationDescription,
  TState = Record<string, any>
>(
  definition: OmitFactoryAndType<
    IEventNodeDefinition<TInput, TOutput, TConfig, TState>
  >,
  eventConfig: CustomEventNodeConfig<TEventPayload, TInput, TOutput, TState>
): Omit<
  IEventNodeDefinition<TInput, TOutput, TConfig, TState>,
  'init' | 'dispose'
> {
  const hiddenProperties =
    definition.configuration?.hiddenProperties?.defaultValue || []

  definition.configuration = {
    ...definition.configuration,
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'eventState', ...hiddenProperties],
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
        initialState: definition.initialState || undefined,
        init: async args => {
          const {
            node,
            engine,
            commit,
            graph: { getDependency },
          } = args

          type CommitArgs = Parameters<typeof commit>

          // Create a new commit function that will rehydrate the state before committing.
          // We use this to ensure the processing of the incoming event is matched to the correct state
          // for the duration of the event.
          const innerCommit = async (
            outflowName: CommitArgs[0],
            completedListener: CommitArgs[1]
          ) => {
            const eventStore = getDependency<IEventStore>('IEventStore')

            commit(outflowName, async resolveSockets => {
              // When the event is done, we sync the state and clear it
              // This sets the state for the next run of this event on this or another engine
              if (eventStore) eventStore.done()

              completedListener?.(resolveSockets)
            })
          }

          const finish = () => {
            if (node && engine) engine.onNodeExecutionEnd.emit(node)
          }

          // Create a new args object with the new commit function
          const handleEventArgs = {
            ...args,
            commit: innerCommit,
            finish: finish,
          }

          const handleEventState = async (
            event: TEventPayload,
            storeEvent = true
          ) => {
            // attach event key to the event here
            // we set the current event in the event store for access in the state
            const eventStore = getDependency<IEventStore>(
              CORE_DEP_KEYS.EVENT_STORE
            )

            // We check for the event state properties and use them to create the state key
            const eventState = node?.configuration?.eventState || []

            const stateKey = getEventStateKey(event, eventState)

            // set the event key  by sorting the event state properties alphabetically and then joining them
            // warning: if we change this key, all agents will lose access to their state
            const eventWithKey = {
              ...event,
              stateKey,
            }

            // Store the event in the event store to be used during the processing of the event
            // this also rehydrates the state for the graph
            if (storeEvent) eventStore?.setEvent(eventWithKey)

            if (!node || !engine) return

            // This allows us to send up the signal that the event node has been triggered by the listener
            engine.onNodeExecutionStart.emit(node)
          }

          // Create a new onStartEvent function that will rehydrate the state before handling the event.
          // This also acts as a wrapper hanlder around the generic handler event which is passed in.
          const onStartEvent = async (event: TEventPayload) => {
            await handleEventState(event)
            // Pass all init args and the event to the callback
            if (eventConfig.handleEvent) {
              eventConfig.handleEvent(event, handleEventArgs)
            }
            finish()
          }

          if (eventConfig.customListener) {
            eventConfig.customListener(getDependency, onStartEvent)
          }

          if (eventConfig.dependencyName && eventConfig.eventName) {
            // todo we should hard type this base emitter better
            const customEventEmitter = getDependency<BaseEmitter>(
              eventConfig.dependencyName
            )

            customEventEmitter?.on(eventConfig.eventName, onStartEvent)

            return {}
          }

          if (eventConfig.init) {
            const newArgs = {
              ...handleEventArgs,
              handleState: handleEventState,
            }
            const returned = eventConfig.init(newArgs)

            return returned
          }

          return {}
        },
        dispose: ({ graph, state }) => {
          const returned = eventConfig.dispose?.({ graph, state })
          return {
            ...returned,
          }
        },
      }),
  }
}
