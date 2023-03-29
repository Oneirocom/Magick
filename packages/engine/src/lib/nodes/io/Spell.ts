import isEqual from 'lodash/isEqual'
import Rete from 'rete'

import { Data } from 'rete/types/core/data'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { SpellControl } from '../../dataControls/SpellControl'
import { MagickComponent } from '../../engine'
import { UpdateModuleSockets } from '../../plugins/modulePlugin'
import { SpellInterface } from '../../schemas'
import { triggerSocket } from '../../sockets'
import {
  EngineContext,
  MagickNode,
  MagickWorkerInputs,
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

export class SpellComponent extends MagickComponent<
  Promise<ModuleWorkerOutput>
> {
  declare updateModuleSockets: UpdateModuleSockets
  subscriptionMap: Record<number, () => void> = {}
  noBuildUpdate: boolean

  constructor() {
    super(
      'Spell',
      {
        outputs: { trigger: 'option' },
      },
      'I/O',
      info
    )

    this.module = {
      nodeType: 'module',
      skip: true,
    }
    this.noBuildUpdate = true
    // this.onDoubleClick = (node: MagickNode) => {
    //   if (!this.editor) return
    //   console.log('double click', node)
    //   const pubsub = this.editor.pubSub
    //   // TODO: Check if events are defined instead of as
    //   const event = pubsub.events.OPEN_TAB
    //   const encodedToId = (uri: string) => {
    //     uri = decodeURIComponent(uri)
    //     return uri.slice(0, 36)
    //   }
    //   pubsub.publish(event, {
    //     type: 'spell',
    //     id: encodedToId(node.data.name as string),
    //     spellName: node.data.name,
    //     name: encodedToId(node.data.name as string),
    //     openNew: false,
    //   })
    // }
  }

  subscribe(node: MagickNode, spellName: string) {
    if (!this.editor) return
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()

    let cache: SpellInterface

    // Subscribe to any changes to that spell here
    this.subscriptionMap[node.id] = this.editor.onSpellUpdated(
      spellName,
      (spell: SpellInterface) => {
        if (!isEqual(spell, cache)) {
          // this can probably be better optimise this
          this.updateSockets(node, spell)
        }

        cache = spell
      }
    )
  }

  builder(node: MagickNode) {
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node.addInput(triggerIn).addOutput(triggerOut)

    const spellControl = new SpellControl({
      name: 'Spell Select',
      write: false,
      defaultValue: (node.data.spell as string) || '',
    })

    node.inspector.add(spellControl)

    // const stateSocket = new Rete.Input('state', 'State', objectSocket)

    const getPublicVariables = graph => {
      console.log('getPublicVariables', graph)
      return Object.values(graph.nodes || {}).filter(
        node => (node as { data: { isPublic: boolean } }).data?.isPublic
      )
    }

    const createInspectorForPublicVariables = publicVariables => {
      if (!node.data.publicVariables) {
        node.data.publicVariables = {} as { [key: string]: unknown }
      }

      publicVariables.forEach(pNode => {
        const { data, name } = pNode as {
          data: { name: string; value: any; fewshot: string }
          name: string
        }
        if (name.includes('Text')) {
          const publicVar = (
            node.data.publicVariables as { [key: string]: unknown }
          )[data.name]
          const fewshotInputControl = new FewshotControl({
            name: name,
            dataKey: data.name,
            language: 'plaintext',
            defaultValue: publicVar || data.value || '',
          })
          if (!node.inspector.dataControls.has(fewshotInputControl.dataKey)) {
            node.inspector.add(fewshotInputControl)
          }
          fewshotInputControl.onData = () => {
            if (!node.data.publicVariables) {
              node.data.publicVariables = {}
            }
            ;(node.data.publicVariables as { [key: string]: unknown })[
              data.name
            ] = node.data[data.name]
          }
        } else if (name.includes('String')) {
          console.log('text variable', data.fewshot)
          const textInputControl = new InputControl({
            name: name,
            dataKey: data.name,
            defaultValue: (data as any).fewshot || data.value,
          })
          if (!node.inspector.dataControls.has(textInputControl.dataKey)) {
            node.inspector.add(textInputControl)
          }
        } else if (name.includes('Number')) {
          const numberInputControl = new NumberControl({
            name: name,
            dataKey: data.name,
            defaultValue: data.value,
          })
          if (!node.inspector.dataControls.has(numberInputControl.dataKey)) {
            node.inspector.add(numberInputControl)
          }
        } else if (name.includes('Boolean')) {
          const booleanInputControl = new BooleanControl({
            name: name,
            dataKey: data.name,
            defaultValue: data.value,
          })
          if (!node.inspector.dataControls.has(booleanInputControl.dataKey)) {
            node.inspector.add(booleanInputControl)
          }
        } else {
          console.warn('unknown variable type', name)
        }
      })
    }

    if (node.data.graph) {
      console.log('node.data.graph', node.data.graph)
      const publicVariables = getPublicVariables(node.data.graph)
      createInspectorForPublicVariables(publicVariables)
    }

    spellControl.onData = async (spell: SpellInterface) => {
      if (!spell.name) return console.warn('spell name not found', spell)
      // break out of it the nodes data already exists.
      if (spell.name === node.data.name) return

      node.data.name = spell.name
      node.data.spellId = spell.id
      node.data.projectId = spell.projectId
      node.data.graph = spell.graph

      // delete all the old controls
      node.inspector.dataControls.forEach(control => {
        if (control instanceof SpellControl) return
        node.inspector.remove(control.dataKey)
      })

      console.log('getPublicVariables', spell)
      // TODO: Set the public variables from the public variables of the spell
      const publicVariables = getPublicVariables(
        node.data.graph || spell.graph || {}
      )

      console.log('createInspectorForPublicVariables', publicVariables)
      createInspectorForPublicVariables(publicVariables)

      // Update the sockets
      this.updateSockets(node, spell)

      // here we handle writing the spells name to the spell itself
      node.data.spell = spell.name

      // Uodate the data name to display inside the node
      node.data.name = spell.name

      // subscribe to changes form the spell to update the sockets if there are changes
      // Note: We could store all spells in a spell map here and rather than receive the whole spell, only receive the diff, make the changes, update the sockets, etc.  Mayb improve speed?
      this.subscribe(node, spell.name)

      console.log('node.inspector.data()', node.inspector.data())

      const context = this.editor && this.editor.magick
      if (!context) return
      const { sendToInspector } = context
      if (sendToInspector) {
        sendToInspector(node.inspector.data())
      }
    }

    // node.addInput(stateSocket)

    if (node.data.graph) {
      const publicVariables = getPublicVariables(node.data.graph)
      createInspectorForPublicVariables(publicVariables)
    }

    if (node.data.name) {
      setTimeout(() => {
        this.subscribe(node, node.data.name as string)
      }, 1000)
    }

    return node
  }

  updateSockets(node: MagickNode, spell: SpellInterface) {
    const graph = JSON.parse(JSON.stringify(spell.graph)) as Data
    this.updateModuleSockets(node, graph, true)
    node.update()
  }

  formatOutputs(node: WorkerData, outputs: Record<string, unknown>) {
    return Object.entries(outputs).reduce((acc, [uuid, value]) => {
      const socketKey = socketKeyFromOutputName(node, uuid)
      if (!socketKey) return acc
      acc[socketKey] = value
      return acc
    }, {} as Record<string, unknown>)
  }

  formatInputs(node: WorkerData, inputs: MagickWorkerInputs) {
    return Object.entries(inputs).reduce((acc, [key, value]) => {
      const name = inputNameFromSocketKey(node, key)
      if (!name) return acc

      acc[name] = value[0]
      return acc
    }, {} as Record<string, unknown>)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: { [key: string]: string },
    {
      magick,
      secrets,
      publicVariables,
    }: {
      module: { outputs: ModuleWorkerOutput[] }
      magick: EngineContext
      secrets: Record<string, string>
      publicVariables: Record<string, string>
    }
  ) {
    // We format the inputs since these inputs rely on the use of the socket keys.
    const flattenedInputs = this.formatInputs(node, inputs)

    if (!magick.runSpell) throw new Error('Magick runSpell not found')
    const outputs = await magick.runSpell({
      inputs: flattenedInputs,
      spellId: node.data.spellId as string,
      projectId: node.data.projectId as string,
      secrets,
      publicVariables,
    })

    return this.formatOutputs(node, outputs)
  }
}
