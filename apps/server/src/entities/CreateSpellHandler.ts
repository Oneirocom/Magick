import {
  buildThothInterface,
  extractModuleInputKeys,
  extractNodes,
} from '../routes/spells/runSpell'
import { creatorToolsDatabase } from '../databases/creatorTools'
import { CustomError } from '../utils/CustomError'
import { Graph, ModuleComponent } from '../routes/spells/types'
import { initSharedEngine, getComponents, } from '@thothai/core/dist/server'
import { Module } from '../routes/spells/module'

import { ModuleType, Task } from '@thothai/core/types'

export const CreateSpellHandler = async (props: {
  spell: any
  version: string
}) => {
  // TODO: create a proper engine interface with the proper methods types on it.
  console.log(
    'Creating Spell Handler',
    'spell:',
    props.spell,
    'version:',
    props.version
  )

  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components: getComponents(),
    server: true,
    modules: {},
  }) as any

  let rootSpell
  if (!props.spell || props.spell === undefined) {
    props.spell = 'default'
  }
  if (!props.version || props.version === undefined) {
    props.version = 'latest'
  }

  const { spell, version = 'latest' } = props

  rootSpell = await creatorToolsDatabase.spells.findOne({
    where: { name: spell },
  })

  // eslint-disable-next-line functional/no-let
  let activeSpell

  if (version === 'latest') {
    console.log('latest')
    activeSpell = rootSpell
  } else {
    console.log('getting active spell')
    activeSpell = await creatorToolsDatabase.deployedSpells.findOne({
      where: { name: spell, version },
    })
  }

  //todo validate spell has an input trigger?
  if (!activeSpell?.graph) {
    throw new CustomError(
      'not-found',
      `Spell with name ${spell} and version ${version} not found`
    )
  }

  // TODO use test spells if body option is given
  // const activeSpell = getTestSpell(spell)
  const graph = activeSpell.graph as Graph
  const modules = activeSpell.modules as Module[]

  const gameState = {
    ...rootSpell?.gameState,
  }

  const thoth = buildThothInterface(null as any, gameState)

  // The module is an interface that the module system uses to write data to
  // used internally by the module plugin, and we make use of it here too.
  // TODO: Test runing nested modules and watch out for unexpected behaviour
  // when child modules overwrite this with their own.
  const module = new Module()
  // Parse array of modules into a map of modules by module name
  const moduleMap = modules?.reduce((modules: any, module: any) => {
    modules[module.name] = module
    return modules
  }, {} as Record<string, ModuleType>)
  // Update the modules available in the module manager during the graph run time

  engine.moduleManager.setModules(moduleMap)

  // ThothContext: map of services expected by Thoth components,
  // allowing client and server provide different sets of helpers that match the common interface
  // EngineContext passed down into the engine and is used by workers.
  const context = {
    module,
    thoth,
    silent: true,
  }

  // Collect all the "trigger ins" that the module manager has gathered
  const triggerIns = engine.moduleManager.triggerIns

  function getFirstNodeTrigger(data: Graph) {
    const extractedNodes = extractNodes(data.nodes, triggerIns)
    return extractedNodes[0]
  }

  // Standard default component to start the serverside run sequence from, which has the run function on it.
  const component = engine.components.get(
    'Module Trigger In'
  ) as ModuleComponent as any

  // Defaulting to the first node trigger to start our "run"
  const triggeredNode = getFirstNodeTrigger(graph) as any

  // Engine process to set up the tasks and prime the system for the first 'run' command.
  await engine.process(graph, null, context)

  const formattedOutputs: Record<string, unknown> = {}
  // Eventual outputs of running the Spell
  const rawOutputs = {} as Record<string, unknown>

  const inputKeys = extractModuleInputKeys(graph) as string[]

  // Return this-- this is the callback for discord, xrengine, etc to handle chat
  async function spellHandler(
    message: string,
    speaker: string,
    agent: string,
    client: string,
    channelId: string,
    entity: any,
    roomInfo: {
      user: string
      inConversation: boolean
      isBot: boolean
      info3d: string
    }[],
    channel: string
  ) {
    const spellInputs = {
      Input: message,
      Speaker: speaker,
      Agent: agent,
      Client: client,
      ChannelID: channelId,
      Entity: entity,
      RoomInfo: roomInfo,
      Channel: channel,
    } as any
    // TODO: Remove this line
    // TEST CASE: Chatting with agent on Discord doesn't get same response over and over
    // This resets everything and makes it work, BUT it is very slow
    // We need to reset the task outputs (and tasks in general) without
    // calling this function here
    let error = null
    const inputs = inputKeys.reduce((inputs, expectedInput: string, idx: number) => {
      const requestInput = spellInputs

      if (requestInput) {
        inputs[expectedInput] = [requestInput]

        return inputs
      } else {
        error = `Spell expects a value for ${expectedInput} to be provided `
        // throw new CustomError(
        //   'input-failed',
        //   error
        // )
      }
    }, {} as Record<string, unknown>)

    engine.tasks.forEach((task: Task) => {
      task.reset()
    })

    // Attaching inputs to the module, which are passed in when the engine runs.
    // you can see this at work in the 'workerInputs' function of module-manager
    // work inputs worker reads from the module inputs via the key in node.data.name
    // important to note: even single string values are wrapped in arrays due to match the client editor format
    module.read(inputs as any)

    await component.run(triggeredNode)

    // Write all the raw data that was output by the module run to an object
    module.write(rawOutputs)

    console.log('rawOutputs are', JSON.stringify(rawOutputs))

    const outputs = Object.values(graph.nodes).filter((node: any) => {
      return node.name.includes('Output')
    })

    console.log('outputs are', JSON.stringify(outputs))

    // Format raw outputs based on the names assigned to Module Outputs node data in the graph
    Object.values(graph.nodes)
      .filter((node: any) => {
        return node.name.includes('Output')
      })
      .forEach((node: any) => {
        formattedOutputs[(node as any).data.name as string] =
          rawOutputs[(node as any).data.socketKey as string]
      })
    if (error) return rawOutputs

    let index = undefined

    for (const x in formattedOutputs) {
      index = x
    }

    if (index && index !== undefined) {
      return formattedOutputs && formattedOutputs[index]
    } else {
      return undefined
    }
  }
  console.log('spellHandler is', spellHandler)
  return spellHandler
}
