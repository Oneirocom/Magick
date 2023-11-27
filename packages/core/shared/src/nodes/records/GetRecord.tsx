import Rete from '@magickml/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
  RecordInterface,
} from '../../types'
import { CollectionControl } from '../../dataControls/CollectionControl'

const info =
  'Gets Records from the Records store. The optional key and collection ID properties will filter the returned Records accordingly, and the Max Count property will limit the number. Records are returned in order of distance.'

type InputReturn = {
  records: Object[]
}

type CollectionSelectData = {
  value: string
  label: string
}

export class GetRecords extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Get Records',
      {
        outputs: {
          records: 'output',
          trigger: 'option',
        },
      },
      'Storage/Records',
      info
    )
    this.common = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('records', 'Records', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const keySocket = new Rete.Input('key', 'Key', stringSocket)
    console.log('node', node.data['collection'])

    const initalCollection = node.data[
      'collection'
    ] as CollectionSelectData | null

    const collectionId = new CollectionControl({
      name: 'Collection',
      icon: 'moon',
      write: true,
      defaultValue: 'All',
      tooltip: 'Select a collection',
      initialValue: initalCollection,
    })

    const key = new InputControl({
      dataKey: 'recordKey',
      name: 'Key',
      icon: 'moon',
      placeholder: 'key',
      tooltip: 'Enter key',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
      defaultValue: '10',
      tooltip: 'Enter max count',
    })

    node.inspector.add(collectionId).add(key).add(max_count)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(keySocket)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: any
  ) {
    const { app } = context.module
    const { projectId } = context

    if (!app) throw new Error('App not found in context')

    const keySocket = inputs['key'] ? inputs['key'][0] : null
    const keyInput = node.data['recordKey'] as string | null

    console.log('keySocket', keySocket)

    const nodeData = node.data as {
      collection: CollectionSelectData
      max_count: string
    }

    const baseQuery = {
      projectId,
      collectionId: nodeData.collection.value,
      $limit: nodeData.max_count ? parseInt(nodeData.max_count) : 10,
    }

    const optionalQuery =
      keySocket || keyInput
        ? {
            key: keySocket ? keySocket : keyInput,
          }
        : {}

    const query = { ...baseQuery, ...optionalQuery }
    console.log('query', query)
    const response = await app.service('records').find({ query })
    console.log('response', response)

    return {
      records: response.data.map((record: RecordInterface) => {
        return {
          key: record.key,
          data: record.data,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        }
      }),
    }
  }
}
