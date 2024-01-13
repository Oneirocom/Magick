import {
  NodeCategory,
  SocketDefinition,
  Assert,
  makeAsyncNodeDefinition,
} from '@magickml/behave-graph'
import { EventPayload } from 'packages/server/plugin/src'
import { pluginName } from 'plugins/slack/src/lib/constants'
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

type ActionNodeConfig<
  TInputs,
  TOutputs extends Record<string, SocketDefinition>,
  TDependencies extends string[],
  TWrite = (key: string, value: any) => void
> = {
  typeName: string
  dependencyKeys: TDependencies
  label?: string
  inputs: TInputs
  outputs: TOutputs
  eventName: string
  process: (
    dependencies: { [K in TDependencies[number]]: any },
    inputs: { [K in keyof TInputs]: any },
    write: TWrite,
    commit: (key: string) => void,
    finished: () => void
  ) => Promise<void>
}

export const testAsyncNode = <
  TInputs extends Record<string, SocketDefinition>,
  TOutputs extends Record<string, SocketDefinition>,
  TDependencies extends string[]
>({
  typeName,
  eventName,
  dependencyKeys,
  label,
  inputs,
  outputs,
  process,
}: ActionNodeConfig<TInputs, TOutputs, TDependencies>) => {
  return makeAsyncNodeDefinition({
    typeName,
    category: NodeCategory.Action,
    label: label ?? `Execute ${typeName.split('/')[0]} Action`,
    in: inputs,
    out: outputs,
    initialState: makeInitialState(),
    triggered: ({
      commit,
      read,
      write,
      finished,
      state,
      graph: { getDependency },
    }) => {
      const dependencies = dependencyKeys.reduce((acc, key) => {
        const dependency = getDependency(key)
        if (!dependency) {
          throw new Error(`Missing required dependency: ${key}`)
        }
        acc[key] = dependency
        return acc
      }, {} as { [K in TDependencies[number]]: any })

      function readInput<K extends keyof TInputs>(key: K): TInputs[K] {
        return read(key as any)
      }

      const inputsData = Object.keys(inputs).reduce((acc, key) => {
        acc[key as keyof TInputs] = readInput(key as keyof TInputs)
        return acc
      }, {} as { [K in keyof TInputs]: any })
      // @ts-ignore
      process(dependencies, inputsData, write, commit, finished)
        .then(() => {})
        .catch(error => {
          console.error('Error in node operation:', error)
          finished && finished()
        })
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
