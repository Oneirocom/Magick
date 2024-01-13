import {
  NodeCategory,
  makeFlowNodeDefinition,
  SocketDefinition,
} from '@magickml/behave-graph'

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
  process: (
    dependencies: { [K in TDependencies[number]]: any },
    inputs: { [K in keyof TInputs]: any },
    write: TWrite,
    commit: (key: string) => void
  ) => Promise<void>
}

export const createAction = <
  TInputs extends Record<string, SocketDefinition>,
  TOutputs extends Record<string, SocketDefinition>,
  TDependencies extends string[]
>({
  typeName,
  dependencyKeys,
  label,
  inputs,
  outputs,
  process,
}: ActionNodeConfig<TInputs, TOutputs, TDependencies>) => {
  return makeFlowNodeDefinition({
    typeName,
    category: NodeCategory.Action,
    label: label ?? `Execute ${typeName.split('/')[0]} Action`,
    in: inputs,
    out: outputs,
    initialState: undefined,
    triggered: async ({ commit, read, write, graph: { getDependency } }) => {
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

      try {
        // @ts-ignore
        await process(dependencies, inputsData, write, commit)
      } catch (e) {
        console.log(e)
      }
    },
  })
}
