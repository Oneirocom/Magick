import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { EventPayload } from 'packages/server/plugin/src'
import EventEmitter from 'events'

type State<T> = {
  onStartEvent?: (event: EventPayload<T>) => void
}

const makeInitialState = <T>(): State<T> => ({
  onStartEvent: undefined,
})

type Base = Pick<
  Parameters<typeof makeEventNodeDefinition>[0],
  'typeName' | 'label' | 'in' | 'out'
>

type TWrite = (key: string, value: any) => void

export type CreateEventNodeProcess<T> = (
  write: TWrite,
  commit: (key: string) => void,
  event: EventPayload<T>
) => void

export type CreateEventNodeInputs<T> = {
  base: Base
  event: string
  emitterDependencyKey: string
  process: CreateEventNodeProcess<T>
}

export const createEventNode = <
  E extends EventEmitter,
  T extends Record<string, unknown>
>(
  inputs: CreateEventNodeInputs<T>
) => {
  return makeEventNodeDefinition({
    ...inputs.base,
    category: NodeCategory.Event,
    initialState: makeInitialState<T>(),
    init: args => {
      const {
        write,
        commit,
        node,
        engine,
        graph: { getDependency },
      } = args
      const onStartEvent = (event: EventPayload<T>) => {
        inputs.process(write, commit, event)

        if (!node || !engine) return

        engine.onNodeExecutionEnd.emit(node)
      }

      const emitter = getDependency<E>(inputs.emitterDependencyKey)

      emitter?.on(inputs.event, onStartEvent)

      return {
        onStartEvent,
      }
    },
    dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
      Assert.mustBeTrue(onStartEvent !== undefined)

      const emitter = getDependency<E>(inputs.emitterDependencyKey)

      if (onStartEvent) emitter?.removeListener(inputs.event, onStartEvent)

      return {}
    },
  })
}
