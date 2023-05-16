// DOCUMENTED
import Rete from 'rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info = 'Get documents from a store'

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
      'Document',
      info
    )
    // this.runFromCache = true
  }

  /**
   * Builds the input and output interface for the GetDocuments node
   * @param node - The Magick node to build the interface for
   * @returns The modified Magick node
   */
  builder(node: MagickNode) {
    // Create input and output sockets
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)
    const out = new Rete.Output('documents', 'Documents', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // Set up controls for input fields
    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'document',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
      defaultValue: '6',
    })

    // Save controls as inspector data for easy reference
    node.inspector.add(type).add(max_count)

    // Build the node's input and output interface
    return node
      .addInput(dataInput)
      .addInput(embedding)
      .addOutput(dataOutput)
      .addOutput(out)
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
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = nodeData.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10
    // replace with feathers service call
    const response = await app.service('documents').find({
      query: {
        projectId,
        type,
        maxCount,
        embedding,
      },
    })

    // get the data from the response
    let documents = response.data as Document[]
    documents = documents.slice(0, maxCount)
    // Return the result for output
    return {
      documents,
    }
  }
}
