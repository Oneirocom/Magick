// DOCUMENTED
import Rete from 'shared/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import {
  documentSocket,
  embeddingSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
  Document,
} from '../../types'

const info =
  'Gets Documents from the Documents store. The optional Type property will return only Documents with the matching type, and the Max Count property will limit the number of Documents returned. Documents are returned in order of distance.'

/**
 * Defines the expected return type for the input data
 */
type InputReturn = {
  documents: Document[]
}

/**
 * Class for fetching documents and providing them as output
 */
export class GetDocuments extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Get Documents',
      {
        outputs: {
          documents: 'output',
          trigger: 'option',
        },
      },
      'Storage/Documents',
      info
    )
    this.common = true
    // this.runFromCache = true
  }

  /**
   * Builds the input and output interface for the GetDocuments node
   * @param node - The Magick node to build the interface for
   * @returns The modified Magick node
   */
  builder(node: MagickNode) {
    // Create input and output sockets
    const embedding = new Rete.Input('embedding', 'Embedding', embeddingSocket)
    const out = new Rete.Output('documents', 'Documents', documentSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const typeSocket = new Rete.Input('type', 'Type', stringSocket)

    // Set up controls for input fields
    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'document',
      tooltip: 'Enter document type',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
      defaultValue: '6',
      tooltip: 'Enter max count',
    })

    // Save controls as inspector data for easy reference
    node.inspector.add(type).add(max_count)

    // Build the node's input and output interface
    return node
      .addInput(dataInput)
      .addInput(embedding)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(typeSocket)
  }

  /**
   * Executes logic to fetch documents and provides them as output
   * @param node - The worker node data
   * @param inputs - The input values to the worker node
   * @param _outputs - The output values to the worker node
   * @returns The output data for the worker node
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: any
  ) {
    const { app } = context.module
    const { projectId } = context

    if (!app) throw new Error('App not found in context')

    const typeSocket = inputs['type'] ? inputs['type'][0] : null

    // Get the worker node's input data
    let embedding = (
      inputs['embedding'] ? inputs['embedding'][0] : null
    ) as number[]

    if (typeof embedding == 'string')
      embedding = (embedding as string)
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map(parseFloat)

    // Get node data according to input values
    const nodeData = node.data as {
      type: string
      max_count: string
    }

    const typeData = nodeData.type as string
    const type =
      typeSocket ??
      (typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none')

    let max_count = 1
    if (typeof node.data.max_count === 'string') {
      max_count = parseInt(node.data.max_count)
    } else if (typeof node.data.max_count === 'number') {
      max_count = node.data.max_count
    } else {
      max_count = 10
    }

    // replace with feathers service call
    const response = await app.service('documents').find({
      query: {
        projectId,
        type,
        $limit: max_count,
        embedding,
      },
    })
    // Return the result for output
    return {
      documents: response.data as Document[],
    }
  }
}
