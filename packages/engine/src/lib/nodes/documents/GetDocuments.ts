import Rete from 'rete'
import { API_ROOT_URL } from '../../config'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../magick-component'
import { arraySocket, triggerSocket } from '../../sockets'
import {
  GetDocumentArgs, MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs, NodeData
} from '../../types'

const info = 'Get documents from a store'

//add option to get only documents from max time difference (time diff, if set to 0 or -1, will get all documents, otherwise will count in minutes)
type InputReturn = {
  documents: any[]
}

const getDocumentsbyEmbedding = async (params: any) => {
      
  const urlString = `${API_ROOT_URL}/documents`
  const url = new URL(urlString)

  Object.entries(params).forEach((p: any) => {
    url.searchParams.append(p[0], p[1])
  })

  const response = await fetch(url.toString())
  if (response.status !== 200) return null
  const json = await response.json()
  return json
}

const getDocuments = async (params: GetDocumentArgs) => {
  const urlString = `${API_ROOT_URL}/documents`
  const url = new URL(urlString)
  for (const p in params) {
    // append params to url, make sure to preserve arrays
    if (Array.isArray(params[p])) {
      params[p].forEach(v => url.searchParams.append(p, v))
    } else {
      url.searchParams.append(p, params[p])
    }
  }
  const response = await fetch(url.toString())
  if (response.status !== 200) return null
  const json = await response.json()
  return json.data
}

export class GetDocuments extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Get Documents')

    this.task = {
      outputs: {
        documents: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Document'
    this.display = true
    this.info = info
    this.runFromCache = true
  }

  builder(node: MagickNode) {    
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)
    const out = new Rete.Output('documents', 'Documents', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

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

    node.inspector.add(type).add(max_count).add(owner)

    return node
      .addInput(dataInput)
      .addInput(embedding)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    
    let embedding = (inputs['embedding'] ? inputs['embedding'][0] : null) as number[]
    if (typeof(embedding) == 'string') embedding = (embedding as any).replace('[',"").replace(']',"");embedding = (embedding as any)?.split(',')
    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = node.data?.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10

    const owner = node.data?.owner as string

    const data = {
      type,
      maxCount,
      owner,
    }
    let documents
    if (embedding) data['embedding'] = embedding
    if (embedding) {
      if (embedding.length === 1536) {
        const enc_embed = new Float32Array(embedding)
        const uint = new Uint8Array(enc_embed.buffer)
        const str = btoa(
          String.fromCharCode.apply(
            null,
            Array.from<number>(new Uint8Array(uint))
          )
        )
        documents = await getDocumentsbyEmbedding({...data, embedding: str })
      }
    } else {
      documents = await getDocuments(data)
    }
    
    return {
      documents,
    }
  }
}
