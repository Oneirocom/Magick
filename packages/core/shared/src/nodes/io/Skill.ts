import Rete from 'rete'
import { MagickComponent } from '../../engine'
import { UpdateModuleSockets } from '../../plugins/modulePlugin'
import { stringSocket, taskSocket, triggerSocket } from '../../sockets'
import { SpellManager } from '../../spellManager'
import {
  AgentTask,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
  ModuleWorkerOutput,
  WorkerData,
} from '../../types'
const info = `The Module component allows you to add modules into your graph.  A module is a bundled self contained graph that defines inputs, outputs, and triggers using components.`

type Socket = {
  socketKey: string
  name: string
}

export const createNameFromSocket = (type: 'inputs' | 'outputs') => {
  return (node: WorkerData, socketKey: string) => {
    return (node.data[type] as Socket[]).find(
      socket => socket.socketKey === socketKey
    )?.name
  }
}

export const createSocketFromName = (type: 'inputs' | 'outputs') => {
  return (node: WorkerData, name: string) => {
    return (node.data[type] as Socket[]).find(socket => socket.name === name)
      ?.socketKey
  }
}

export const inputNameFromSocketKey = createNameFromSocket('inputs')
export const outputNameFromSocketKey = createNameFromSocket('outputs')
export const socketKeyFromInputName = createSocketFromName('inputs')
export const socketKeyFromOutputName = createSocketFromName('outputs')

export class Skill extends MagickComponent<Promise<ModuleWorkerOutput>> {
  declare updateModuleSockets: UpdateModuleSockets
  subscriptionMap: Record<number, () => void> = {}
  noBuildUpdate: boolean

  constructor() {
    super(
      'Skill',
      {
        outputs: { output: 'output', trigger: 'option' },
      },
      'Experimental',
      info
    )

    this.module = {
      nodeType: 'module',
      skip: true,
    }
    this.noBuildUpdate = true
    this.display = true
  }

  builder(node: MagickNode) {
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const spellName = new Rete.Input('spellName', 'Spell Name', stringSocket)
    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const taskInput = new Rete.Input('task', 'Task', taskSocket)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket)
    node
      .addInput(triggerIn)
      .addOutput(triggerOut)
      .addInput(contentInput)
      .addInput(spellName)
      .addInput(taskInput)
      .addOutput(output)

    return node
  }

  formatOutputs(node: WorkerData, outputs: Record<string, unknown>) {
    return Object.entries(outputs).reduce((acc, [uuid, value]) => {
      const socketKey = socketKeyFromOutputName(node, uuid)
      if (!socketKey) return acc
      acc[socketKey] = value
      return acc
    }, {} as Record<string, unknown>)
  }

  // @ts-ignore
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: { [key: string]: string },
    _context: ModuleContext
  ) {
    const spellName = inputs['spellName'] && (inputs['spellName'][0] as string)
    const task = inputs['task'] && (inputs['task'][0] as AgentTask)
    const content = inputs['content'] && (inputs['content'][0] as string)

    if (task) {
      task.eventData.content = content || task.eventData.content
    }

    const { module, spellManager } = _context

    const { agent, app, secrets } = module

    // call the spells service and find a spell where name is spellName and projectId is projectId
    const spell = await app?.service('spells').find({
      query: {
        name: spellName,
        // projectId,
      },
    })

    if (!spell) {
      throw new Error(`Spell ${spellName} not found`)
    }

    const firstSpell = spell.data[0]

    if (!firstSpell) {
      throw new Error(`Spell ${spellName} not found`)
    }

    const spellId = firstSpell.id || firstSpell._id

    console.log('spellId', spellId)
    console.log('******* RAN SKILL *******')

    const { projectId } = _context
    if (module.agent) {
      const spellManager = module.agent.spellManager as SpellManager
      const spellRunner = await spellManager.loadById(spellId)
      const runComponentArgs = {
        inputs: {
          'Input - Default': task,
        },
        runSubspell: false,
        agent: agent,
        secrets: agent?.secrets ?? secrets,
        app: module.app,
        publicVariables: {},
      }
      const outputs = await spellRunner?.runComponent(runComponentArgs)

      return {
        output: outputs,
      }
    } else {
      const runComponentArgs = {
        inputs: {
          'Input - Default': task,
        },
        runSubspell: false,
        spellId: spellId as string,
        projectId,
        secrets: secrets as Record<string, string>,
        publicVariables: {},
        app: module.app,
      }

      const outputs = await spellManager.run(runComponentArgs as any)

      // get the first value from outputs
      const output = Object.values(outputs)[0]

      return {
        output,
      }
    }
  }
}
