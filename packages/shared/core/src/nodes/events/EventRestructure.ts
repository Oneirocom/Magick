// DOCUMENTED
/**
 * @file Event Restructure Component - Restructure Event Data
 * @module EventRestructureComponent
 * @version 1.0.0
 */

import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'
import { MagickComponent } from '../../engine'
import {
  arraySocket,
  eventSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import { Event, MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/** Component information */
const info =
  'Takes the various components that make up an event as inputs and outputs a new event that contains the data from the inputs.'

/**
 * Event Restructure Component.
 * @extends {MagickComponent<Promise<{ output: Event }>>}
 */
export class EventRestructureComponent extends MagickComponent<
  Promise<{ output: Event }>
> {
  /**
   * Initializes a new EventRestructureComponent.
   */
  constructor() {
    // Name of the component
    super(
      'Event Restructure',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Storage/Events',
      info
    )
  }

  /**
   * Configuration for rete node component.
   * @param {MagickNode} node - The node being configured.
   * @returns {MagickNode} The configured node.
   */
  builder(node: MagickNode): MagickNode {
    // Generate a socket key if it does not exist.
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // Create inputs and outputs.
    const content = new Rete.Input('content', 'content', stringSocket)
    const sender = new Rete.Input('sender', 'sender', stringSocket)
    const observer = new Rete.Input('observer', 'observer', stringSocket)
    const client = new Rete.Input('client', 'client', stringSocket)
    const channelType = new Rete.Input(
      'channelType',
      'channelType',
      stringSocket
    )
    const rawData = new Rete.Input('rawData', 'rawData', stringSocket)
    const projectId = new Rete.Input('projectId', 'projectId', stringSocket)
    const channel = new Rete.Input('channel', 'channel', stringSocket)
    const connector = new Rete.Input('connector', 'connector', stringSocket)
    const entities = new Rete.Input('entities', 'entities', arraySocket)
    const agentId = new Rete.Input('agentId', 'agentId', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const event = new Rete.Output('output', 'output', eventSocket)

    // Add inputs and outputs to the node.
    return node
      .addInput(connector)
      .addInput(dataInput)
      .addInput(content)
      .addInput(agentId)
      .addInput(channel)
      .addInput(channelType)
      .addInput(rawData)
      .addInput(client)
      .addInput(entities)
      .addInput(observer)
      .addInput(projectId)
      .addInput(sender)
      .addOutput(dataOutput)
      .addOutput(event)
  }

  /**
   * Node execution logic.
   * @param {WorkerData} _node - The node being executed.
   * @param {MagickWorkerInputs} inputs - Input values of the node.
   * @returns {Promise<{ output: Event }>} Output event object.
   */
  async worker(
    _node: WorkerData,
    inputs: MagickWorkerInputs
  ): Promise<{ output: Event }> {
    // Initialize an empty output object.
    const output: Record<string, unknown> = {}

    // Populate the output object with input values.
    Object.entries(inputs).forEach(([k, v]) => {
      if (k === 'agentId') {
        output[k] = parseInt(v[0] as string)
      } else {
        output[k] = v[0]
      }
    })

    // Return the output event object.
    return {
      output,
    }
  }
}
