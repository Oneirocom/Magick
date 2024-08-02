import {
  AsyncNodeInstance,
  IAsyncNodeDefinition,
  INodeDefinition,
  NodeConfigurationDescription,
  NodeType,
  SocketsDefinition,
  makeCommonProps,
} from '@magickml/behave-graph'
import { IEventStore } from '../services/eventStore'

type OmitFactoryAndType<T extends INodeDefinition> = Omit<
  T,
  'nodeFactory' | 'nodeType' | 'definition'
>

export function makeMagickAsyncNodeDefinition<
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TConfig extends NodeConfigurationDescription,
  TState
>(
  definition: OmitFactoryAndType<
    IAsyncNodeDefinition<TInput, TOutput, TConfig, TState>
  >
): Omit<
  IAsyncNodeDefinition<TInput, TOutput, TConfig, TState>,
  'init' | 'dispose'
> {
  return {
    ...definition,
    nodeFactory: (graph, config, id) =>
      new AsyncNodeInstance({
        ...makeCommonProps(NodeType.Event, definition, config, graph, id),
        initialState: definition.initialState,
        triggered: async args => {
          const { commit, graph } = args

          const { getDependency } = graph

          type CommitArgs = Parameters<typeof commit>

          // We need to override the normal commmit so we can handle awaiting the event
          const innerCommit = async (
            outflowName: CommitArgs[0],
            completedListener: CommitArgs[1]
          ) => {
            const eventStore = getDependency<IEventStore>('IEventStore')

            commit(outflowName, async resolveSockets => {
              // Now that the event is complete, we can set the event store to done.
              if (eventStore) {
                eventStore.finish()
                eventStore.done()
              }

              await completedListener?.(resolveSockets)
            })
          }

          // Create a new args object with the new commit function
          const newArgs = {
            ...args,
            commit: innerCommit,
          }

          const eventStore = getDependency<IEventStore>('IEventStore')

          // We need to set  the event store to await so that the completion of the main event
          // does not trigger the next event.
          eventStore?.await()

          // trigger the original caller with the new args
          return definition.triggered(newArgs)
        },
        dispose: definition.dispose,
      }),
  }
}
