// DOCUMENTED
import Rete from 'rete'
import { API_ROOT_URL } from '../../config'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  GetDocumentArgs,
  GetEventArgs,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
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
    const pageContent = new Rete.Input('pageContent', 'Page Content', stringSocket)
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

    const owner = new InputControl({
      dataKey: 'owner',
      name: 'Owner',
      icon: 'moon',
      placeholder: 'owner',
    })

    // Save controls as inspector data for easy reference
    node.inspector.add(type).add(max_count).add(owner)

    // Build the node's input and output interface
    return node
      .addInput(dataInput)
      .addInput(pageContent)
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
    context: ModuleContext
  ) {

    const { app } = context.module
    if (!app) throw new Error('App is not defined, cannot create event')

    const getEvents = async (params: any) => {
      const result = await app.service('documents').find({ query: params })
      // app is a feathers-koa app
      const { events } = result

      return events
    }
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
      owner: string
    }
    console.log("NODE DATA:", nodeData)
    const projectId = context.projectId
    const typeData = nodeData.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = nodeData.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10

    const owner = nodeData.owner as string

    const content = inputs['pageContent'] ? inputs['pageContent'][0] : null
    
    let documents
    const limit = maxCountData ? parseInt(maxCountData) : 10
    // Create an object with the processed data
    const data = {
      type,
      maxCount,
      owner,
      content,
      limit
    }
    if (embedding) {
      data['embedding'] = embedding
    }

    if (embedding) {
      if (embedding.length === 1536) {
        const enc_embed = new Float32Array(embedding as Iterable<number>)
        const uint = new Uint8Array(enc_embed.buffer)
        const str = btoa(
          String.fromCharCode.apply(
            null,
            Array.from<number>(new Uint8Array(uint))
          )
        )
        data['embedding'] = str
      }
    }

    documents = getEvents({...data, projectId})
    // Return the result for output
    return {
      documents,
    }
  }
}
