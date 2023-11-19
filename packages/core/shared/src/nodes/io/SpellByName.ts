import Rete from '@magickml/rete'
import { MagickComponent } from '../../engine'
import { UpdateModuleSockets } from '../../plugins/modulePlugin'
import {
  eventSocket,
  objectSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import {
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

export class SpellByName extends MagickComponent<Promise<ModuleWorkerOutput>> {
  declare updateModuleSockets: UpdateModuleSockets
  subscriptionMap: Record<number, () => void> = {}
  noBuildUpdate: boolean

  constructor() {
    super(
      'Spell By Name',
      {
        outputs: { outputs: 'output', trigger: 'option' },
      },
      'Invoke/Spells',
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
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const spellInputs = new Rete.Input('inputs', 'Inputs', objectSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outputs = new Rete.Output('outputs', 'Outputs', objectSocket)
    node
      .addInput(triggerIn)
      .addOutput(triggerOut)
      .addInput(spellName)
      .addInput(eventInput)
      .addInput(spellInputs)
      .addOutput(outputs)

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
    const event = inputs['event'] && (inputs['event'][0] as any)
    const { agent, module, spellManager } = _context
    const { app, secrets } = module

    if (!app) {
      throw new Error('Feathers App not found in SpellByName node worker')
    }

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

    const spellInputs = inputs.inputs[0] as Record<string, unknown>

    const { projectId } = _context
    if (agent) {
      const runComponentArgs = {
        inputs: {
          'Input - Subspell': event,
          ...spellInputs,
        },
        runSubspell: false,
        spellId,
        agentId: agent?.id,
        secrets: agent?.secrets ?? secrets,
        app: module.app,
        publicVariables: {},
      }
      const spellOutputs = await app
        .get('agentCommander')
        .runSpellWithResponse(runComponentArgs)

      return {
        outputs: spellOutputs,
      }
    } else {
      const runComponentArgs = {
        inputs: {
          'Input - Subspell': event,
          ...spellInputs,
        },
        runSubspell: false,
        spellId: spellId as string,
        projectId,
        secrets: secrets as Record<string, string>,
        publicVariables: {},
        app: module.app,
      }

      const spellRunner = await spellManager.loadById(spellId)

      if (!spellRunner) {
        throw new Error(`Spell runner for ${spellName} not found`)
      }

      const spellOutputs = await spellRunner.runComponent(runComponentArgs)

      return {
        outputs: spellOutputs,
      }
    }
  }
}
