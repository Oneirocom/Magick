// DOCUMENTED
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { anySocket, eventSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

/** Component info text */
const info = `The output component will pass values out from your spell.
You can have multiple outputs in a spell and all output values will be collected.
It also has an option to send the output to the playtest area for easy testing.`

/** Default output types */
const defaultOutputTypes = [{ name: 'Default', socket: anySocket }]

/**
 * Output component
 */
export class Output extends MagickComponent<void> {
  /**
   * Constructor for Output component
   */
  constructor() {
    super(
      'Output',
      {
        runOneInput: true,
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'I/O',
      info
    )

    this.module = {
      nodeType: 'output',
      socket: anySocket,
    }
  }

  /**
   * Builder for Output component
   * @param node - MagickNode instance
   * @returns MagickNode instance with configured inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)
    const event = new Rete.Input('event', 'Event Override', eventSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    node.data.sendToPlaytest = true

    const values = [...defaultOutputTypes, ...pluginManager.getOutputTypes()]
    node.data.isOutput = true
    node.data.name = node.data.name ?? `Output - ${values[0].name}`
    node.data.sendToPlaytest = true

    const outputType = new DropdownControl({
      name: 'Output Type',
      dataKey: 'outputType',
      values: values.map(v => v.name),
      defaultValue: values[0].name || 'Default',
    })

    outputType.onData = data => {
      node.data.name = `Output - ${data}`
    }
    node.inspector.add(outputType)
    // need to automate this part! Won't work without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(event)
      .addOutput(triggerOutput)
      .addOutput(output)
  }

  /**
   * Worker function for Output component
   * @param node - WorkerData object
   * @param inputs - MagicWorkerInputs object
   * @param _outputs - MagicWorkerOutputs object
   * @param context - Module and EditorContext instances
   * @returns output data
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<{ output: string }> {
    const inputName = Object.keys(context.data)[0]

    if (!inputs.input) {
      console.error('No input provided to output component')
      return { output: '' }
    }
    const { module, data } = context

    const outputType = node.data.outputType || inputName.replace('Input - ', '') || 'Default'
    const output = (inputs.input.filter(Boolean)[0] ?? '') as string
    const event =
      inputs.event?.[0] || (data && (Object.values(data)[0] as unknown[]))

    if (module.agent) {
      if (outputType && (outputType as string).includes('Default')) {
        const type = pluginManager.getInputTypes().find(type => {
          return type.name === inputName.replace('Input - ', '')
        })

        const responseOutputType = type?.defaultResponseOutput
        const out = module.agent.outputTypes.find(
          t => t.name === responseOutputType
        )

        out.handler({
          output,
          agent: module.agent,
          event,
        })
      } else {
        // Find the outputType in the outputTypes array
        const t = module.agent.outputTypes.find(t => t.name === outputType)
        console.log('module.agent.outputTypes', module.agent.outputTypes)
        console.log('outputType', outputType)

        // Find outputType in outputTypes where name is outputType
        if (!t) {
          console.error('output type is not defined', t)
        } else if (!t.handler) {
          console.error('output type handler is not defined', t)
        } else {
          t.handler({
            output,
            agent: module.agent,
            event,
          })
        }
      }
    }

    return {
      output,
    }
  }
}
