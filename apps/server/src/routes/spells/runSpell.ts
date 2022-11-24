import { initSharedEngine, getComponents } from '@thothai/core/dist/server'
import { ThothWorkerInputs } from '@thothai/core/types'
import Koa from 'koa'
import { CompletionRequest, completionsParser } from '../completions'
import { Module } from './module'
import { Graph, Module as ModuleType, ModuleComponent, Node } from './types'

// todo: make these dynamically loaded
// import { getEnkiOutputs } from '../enki/enki'
// import { huggingface } from '../vendor/huggingface/huggingface'

// const { initSharedEngine, getComponents } = thothCore
const thothComponents = getComponents()

export const buildThothInterface = (
  ctx: Koa.Context,
  initialGameState: Record<string, unknown>
) => {
  // eslint-disable-next-line functional/no-let
  let gameState = { ...initialGameState }

  return {
    completion: async (request: CompletionRequest) => {
      const response = await completionsParser({
        ...request,
        prompt: request.prompt?.trim(),
        stop: request.stop,
      })
      return response?.result || ''
    },
    // enkiCompletion: async (taskName: string, inputs: string) => {
    //   const outputs = await getEnkiOutputs(ctx, taskName, inputs)
    //   return { outputs }
    // },
    // huggingface: async (model: string, options: any) => {
    //   const outputs = await huggingface({ context: ctx, model, options })
    //   return { outputs }
    // },
    getCurrentGameState: () => {
      return gameState
    },
    updateCurrentGameState: (update: Record<string, unknown>) => {
      const newState = {
        ...gameState,
        ...update,
      }

      gameState = newState
    },
    processCode: (
      code: string,
      inputs: ThothWorkerInputs,
      data: any,
      state: Record<string, unknown>
    ) => {
      const flattenedInputs = Object.entries(inputs).reduce(
        (acc, [key, value]) => {
          // @ts-ignore
          acc[key as string] = value[0] as any
          return acc
        },
        {} as Record<string, any>
      )
      // eslint-disable-next-line no-new-func
      const result = new Function('"use strict";return (' + code + ')')()(
        flattenedInputs,
        data,
        state
      )
      return result
    },
  }
}

export const extractModuleInputKeys = (data: Graph) => {
  return Object.values(data.nodes).reduce((inputKeys, node: Node) => {
    if (node.name !== 'Universal Input') return inputKeys
    if (node.data.name && !node.data.useDefault) inputKeys.push(node.data.name)

    return inputKeys
  }, [] as string[])
}

export function extractNodes(nodes: Record<string, Node>, map: Set<unknown>) {
  const names = Array.from(map.keys())
  return Object.keys(nodes)
    .filter(k => names.includes(nodes[k].name))
    .map(k => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1])
}

// TODO: create a proper engine interface with the proper methods types on it.
const engine = initSharedEngine({
  name: 'demo@0.1.0',
  components: thothComponents,
  server: true,
  modules: {},
}) as any

export const runSpell = async (
  graph: Graph,
  inputs: Record<string, unknown>,
  thoth: Record<string, unknown>,
  modules?: ModuleType[]
) => {
  console.log('************ RUN SPELL')
  console.log(inputs)
  // The module is an interface that the module system uses to write data to
  // used internally by the module plugin, and we make use of it here too.
  // TODO: Test runing nested modules and watch out for unexpected behaviour
  // when child modules overwrite this with their own.

  const module = new Module()
  // Parse array of modules into a map of modules by module name
  const moduleMap = modules?.reduce((modules, module) => {
    modules[module.name] = module
    return modules
  }, {} as Record<string, ModuleType>)
  // Update the modules available in the module manager during the graph run time
  engine.moduleManager.setModules(moduleMap)

  // Eventual outputs of running the Spell
  const rawOutputs = {} as Record<string, unknown>

  // Attaching inputs to the module, which are passed in when the engine runs.
  // you can see this at work in the 'workerInputs' function of module-manager
  // work inputs worker reads from the module inputs via the key in node.data.name
  // important to note: even single string values are wrapped in arrays due to match the client editor format
  module.read(inputs)

  // ThothContext: map of services expected by Thoth components,
  // allowing client and server provide different sets of helpers that match the common interface

  // EngineContext passed down into the engine and is used by workers.
  const context = {
    module,
    thoth,
    silent: true,
  }
  // Engine process to set up the tasks and prime the system for the first 'run' command.
  await engine.process(graph, null, context)

  // Collect all the "trigger ins" that the module manager has gathered
  const triggerIns = engine.moduleManager.triggerIns

  function getFirstNodeTrigger(data: Graph) {
    const extractedNodes = extractNodes(data.nodes, triggerIns)
    return extractedNodes[0]
  }

  // Standard default component to start the serverside run sequence from, which has the run function on it.
  const component = engine.components.get(
    'Module Trigger In'
  ) as ModuleComponent

  // Defaulting to the first node trigger to start our "run"
  const triggeredNode = getFirstNodeTrigger(graph)
  await component.run(triggeredNode)
  // Write all the raw data that was output by the module run to an object
  module.write(rawOutputs)

  const formattedOutputs: Record<string, unknown> = {}

  // Format raw outputs based on the names assigned to Module Outputs node data in the graph
  Object.values(graph.nodes)
    .filter(node => {
      return node.name.includes('Output')
    })
    .forEach((node: Node) => {
      formattedOutputs[node.data.name as string] =
        rawOutputs[node.data.socketKey as string]
    })

  return formattedOutputs
}
