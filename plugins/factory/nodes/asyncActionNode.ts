import {
  NodeCategory,
  Assert,
  makeAsyncNodeDefinition,
} from '@magickml/behave-graph'

import { EventPayload } from 'packages/server/plugin/src'
import TypedEmitter from 'typed-emitter'

interface Events {
  error: (error: any) => void
  [key: string]: (event: EventPayload) => void
}

type EmitterType = TypedEmitter<Events>

type State = {
  onStartEvent?: (event: EventPayload) => void | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})
type NodeHandler<T = any> = (inputs: T) => Promise<any>

export function createActionNode<T = any>(
  typeName: string,
  label: string,
  pluginName: string,
  inputs: Record<string, string>,
  outputs: Record<string, string>,
  handler: NodeHandler<T>,
  eventName: string
) {
  return makeAsyncNodeDefinition({
    initialState: makeInitialState(),
    typeName: typeName,
    category: NodeCategory.Action,
    label,
    in: inputs,
    out: outputs,
    triggered: ({ commit, read, write, finished, state }) => {
      const inputValues = Object.keys(inputs).reduce((acc, key) => {
        acc[key] = read(key)
        return acc
      }, {} as T)

      try {
        handler(inputValues)
          .then(result => {
            Object.entries(result).forEach(([key, value]) => {
              write(key, value)
            })
            commit('flow')
            finished && finished()
          })
          .catch(error => {
            console.error('Error in node operation:', error)
            finished && finished()
          })
      } catch (error) {
        console.error('Error in node operation:', error)
        finished && finished()
      }
      return state
    },

    dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
      Assert.mustBeTrue(onStartEvent !== undefined)

      const requestEventEmitter = getDependency<EmitterType>(pluginName)

      if (onStartEvent)
        requestEventEmitter?.removeListener(eventName, onStartEvent)

      return {}
    },
  })
}
