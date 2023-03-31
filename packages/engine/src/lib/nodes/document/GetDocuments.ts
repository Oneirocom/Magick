// GENERATED 
import Rete from 'rete'
import { API_ROOT_URL } from '../../config'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket } from '../../sockets'
import {
  GetDocumentArgs, MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = 'Get documents from a store'

/**
 * Defines the expected return type for the input data
 */
type InputReturn = {
  documents: Document[]
}

/**
 * Fetches documents by embedding and returns the result
 * @param params - The parameters for the GET request
 * @returns The fetched JSON data
 */
const getDocumentsbyEmbedding = async (params: Record<string, string>) => {
  const urlString = `${API_ROOT_URL}/documents`
  const url = new URL(urlString)

  // Add GET request parameters
  Object.entries(params).forEach((p) => {
    url.searchParams.append(p[0], p[1])
  })

  const response = await fetch(url.toString())
  if (response.status !== 200) return null
  const json = await response.json()
  return json
}

/**
 * Fetches documents and returns the result
 * @param params - The parameters for the GET request
 * @returns The fetched JSON data
 */
const getDocuments = async (params: GetDocumentArgs) => {
  const urlString = `${API_ROOT_URL}/documents`
  const url = new URL(urlString)

  // Add GET request parameters
  for (const p in params) {
    // Append arrays correctly for URL search query
    if (Array.isArray(params[p])) {
      // Add array elements as separate parameters
      params[p].forEach(v => url.searchParams.append(p, v))
    } else {
      // Add non-array values as is
      url.searchParams.append(p, params[p])
    }
  }

  const response = await fetch(url.toString())
  if (response.status !== 200) return null
  const json = await response.json()
  return json.data as Document // TODO: Validate
}

/**
 * Class for fetching documents and providing them as output
 */
export class GetDocuments extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Get Documents', {
      outputs: {
        documents: 'output',
        trigger: 'option',
      },
    }, 'Document', info)
    this.runFromCache = true
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
      placeholder: 'document'
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
      placeholder: 'owner'
    })

    // Save controls as inspector data for easy reference
    node.inspector.add(type).add(max_count).add(owner)

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
  ) {
    // Get the worker node's input data
    let embedding = (inputs['embedding'] ? inputs['embedding'][0] : null) as number[]
    if (typeof (embedding) == 'string')
      embedding = (embedding as string)
        .replace('[', "")
        .replace(']', "")
        .split(',')
        .map(parseFloat)

    // Get node data according to input values
    const nodeData = node.data as {
      type: string
      max_count: string
      owner: string
    }

    const typeData = nodeData.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = nodeData.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10

    const owner = nodeData.owner as string

    // Create an object with the processed data
    const data = {
      type,
      maxCount,
      owner,
    }
    let documents

    // Get document results
    if (embedding) {
      data['embedding'] = embedding
      if (embedding.length === 1536) {
        const enc_embed = new Float32Array(embedding)
        const uint = new Uint8Array(enc_embed.buffer)
        const str = btoa(
          String.fromCharCode.apply(
            null,
            Array.from<number>(new Uint8Array(uint))
          )
        )
        documents = await getDocumentsbyEmbedding({ ...data, maxCount: data.maxCount.toString(), embedding: str })
      }
    } else {
      documents = await getDocuments(data)
    }

    // Return the result for output
    return {
      documents,
    }
  }
}