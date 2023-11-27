import Rete from '@magickml/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { stringSocket, objectSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { CollectionControl } from '../../dataControls/CollectionControl'

const info =
  'Creates Records in the Records store. Provide a collection ID, key and data to create a new record.'

type InputReturn = {
  createdRecord: Object
}

type CollectionSelectData = {
  value: string
  label: string
}

export class CreateRecords extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Create Records',
      {
        outputs: {
          createdRecord: 'output',
          trigger: 'option',
        },
      },
      'Storage/Records',
      info
    )
    this.common = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('createdRecord', 'Created Record', objectSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const keySocket = new Rete.Input('key', 'Key', stringSocket)
    const dataSocket = new Rete.Input('data', 'Data', objectSocket)

    const initialCollection = node.data[
      'collection'
    ] as CollectionSelectData | null

    const collectionId = new CollectionControl({
      name: 'Collection',
      icon: 'moon',
      write: true,
      defaultValue: 'All',
      tooltip: 'Select a collection',
      initialValue: initialCollection,
    })

    const key = new InputControl({
      dataKey: 'recordKey',
      name: 'Key',
      icon: 'moon',
      placeholder: 'key',
      tooltip: 'Enter key',
    })

    node.inspector.add(collectionId).add(key)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(keySocket)
      .addInput(dataSocket)
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
    const dataSocket = inputs['data'] ? inputs['data'][0] : null

    const keyInput = node.data['recordKey'] as string | null

    const nodeData = node.data as {
      collection: CollectionSelectData
    }

    const recordData = {
      projectId,
      collectionId: nodeData.collection.value,
      key: keySocket ? keySocket : keyInput,
      data: dataSocket,
    }

    const response = await app.service('records').create(recordData)

    return {
      createdRecord: response,
    }
  }
}
