import {
  EngineContext,
  GraphData,
  ModuleComponent,
  NodeData,
  Subspell,
} from '../types'
import { ThothEngine } from '../engine'
import { Module } from '../plugins/modulePlugin/module'
import { extractNodes } from './graphHelpers'

type RunGraphArguments = {
  graph: GraphData
  inputs: Record<string, unknown>
  thoth: EngineContext
  engine: ThothEngine
  subspells?: Subspell[]
}

function getFirstNodeTrigger(data: GraphData, map: Set<unknown>) {
  const extractedNodes = extractNodes(data.nodes, map)
  return extractedNodes[0]
}

export const runGraph = async ({
  graph,
  inputs,
  thoth,
  engine,
  subspells,
}: RunGraphArguments) => {
  // The module is an interface that the module system uses to write data to
  // used internally by the module plugin, and we make use of it here too.
  // TODO: Test runing nested modules and watch out for unexpected behaviour
  // when child modules overwrite this with their own.

  const module = new Module()

  // Parse array of modules into a map of modules by module name
  const subspellMap = subspells?.reduce((subspellList, subspell) => {
    subspellList[subspell.name] = subspell
    return subspellList
  }, {} as Record<string, Subspell>)

  // Update the modules available in the module manager during the graph run time
  engine.moduleManager.setModules(subspellMap)

  // Eventual outputs of running the Spell
  const rawOutputs = {} as Record<string, unknown>

  //Attaching inputs to the module, which are passed in when the engine runs.
  // you can see this at work in the 'workerInputs' function of module-manager
  // work inputs worker reads from the module inputs via the key in node.data.name
  // important to note: even single string values are wrapped in arrays due to match the client editor format
  module.read(inputs as any)

  // ThothContext: map of services expected by Thoth components,
  // allowing client and server provide different sets of helpers that match the common interface

  // EngineContext passed down into the engine and is used by workers.
  const context = {
    module,
    thoth,
    silent: true,
  }
  // Engine process to set up the tasks and prime the system for the first 'run' command.
  await engine?.process(graph as any, null, context)

  // Collect all the "trigger ins" that the module manager has gathered
  const { triggerIns } = engine.moduleManager

  // Standard default component to start the serverside run sequence from, which has the run function on it.
  const component = engine?.components.get(
    'Module Trigger In'
  ) as ModuleComponent

  // Defaulting to the first node trigger to start our "run"
  const triggeredNode = getFirstNodeTrigger(graph, triggerIns)

  await component?.run(triggeredNode)
  // Write all the raw data that was output by the module run to an object
  module.write(rawOutputs)

  const formattedOutputs: Record<string, unknown> = {}

  // Format raw outputs based on the names assigned to Module Outputs node data in the graph
  Object.values(graph.nodes)
    .filter(node => node.name === 'Module Output' || node.name === 'Output')
    .forEach((node: NodeData) => {
      formattedOutputs[node.data.name as string] =
        rawOutputs[node.data.socketKey as string]
    })

  return formattedOutputs
}
