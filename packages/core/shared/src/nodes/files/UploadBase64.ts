// DOCUMENTED
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import {
  CompletionInspectorControls,
  CompletionProvider,
  CompletionSocket,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { pluginManager } from '../../plugin'
import { getLogger } from '../../logger'

// Information about the component
const info = 'Uploads base64 files to a storage provider.'

/**
 * Type definition for the worker return.
 * @property urls - The urls of the uploaded files.
 */
type WorkerReturn = {
  urls: string[]
}

/**
 * Type definition for the worker data.
 * @property data - The data for the worker.
 * @property data.files - The files to upload.
 * @property data.storage - The storage provider to use.
 */
interface ExtendedWorkerData extends WorkerData {
  data: {
    files?: Uint8Array[]
    storage: string
  }
}

/**
 * UploadBase64 component responsible for uploading base64 files to a storage provider.
 */
export class UploadBase64 extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component and its output sockets definition
    super(
      'Upload Base64 Files',
      {
        outputs: {
          urls: 'output',
          trigger: 'option',
        },
      },
      'Files',
      info
    )
  }

  /**
   * Builds the node component, adding necessary inputs and outputs.
   * @param node - The MagickNode to be built.
   * @returns The built node with the appropriate inputs and outputs.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // get completion providers for the storage and upload completion types
    const completionProviders = pluginManager.getCompletionProviders(
      'storage',
      ['upload']
    ) as CompletionProvider[]

    // get the models from the completion providers and flatten into a single array
    const storageProviders = completionProviders
      .map(provider => provider.models)
      .flat()

    const storageProvider = new DropdownControl({
      name: 'Storage Provider',
      dataKey: 'storage',
      values: storageProviders,
      defaultValue: storageProviders[0],
    })

    node.inspector.add(storageProvider)

    node.addInput(triggerInput).addOutput(triggerOutput)

    let lastInputSockets: CompletionSocket[] | undefined = []
    let lastOutputSockets: CompletionSocket[] | undefined = []
    let lastInspectorControls: CompletionInspectorControls[] | undefined = []

    /**
     * Configure the provided node according to the selected storage provider.
     */
    const configureNode = () => {
      const storage = node.data.storage as string
      const provider = completionProviders.find(provider =>
        provider.models.includes(storage)
      ) as CompletionProvider
      const inspectorControls = provider.inspectorControls
      const inputSockets = provider.inputs
      const outputSockets = provider.outputs
      const connections = node.getConnections()

      // update inspector controls
      if (inspectorControls !== lastInspectorControls) {
        lastInspectorControls?.forEach(control => {
          node.inspector.dataControls.delete(control.dataKey)
        })
        inspectorControls?.forEach(control => {
          const _control = new control.type(control)
          node.inspector.add(_control)
        })
        lastInspectorControls = inspectorControls
      }
      // update input sockets
      if (inputSockets !== lastInputSockets) {
        lastInputSockets?.forEach(socket => {
          if (node.inputs.has(socket.socket)) {
            connections.forEach(c => {
              if (c.input.key === socket.socket)
                this.editor?.removeConnection(c)
            })

            node.inputs.delete(socket.socket)
          }
        })
        inputSockets.forEach(socket => {
          node.addInput(new Rete.Input(socket.socket, socket.name, socket.type))
        })
        lastInputSockets = inputSockets
      }
      // update output sockets
      if (outputSockets !== lastOutputSockets) {
        lastOutputSockets?.forEach(socket => {
          if (node.outputs.has(socket.socket))
            node.outputs.delete(socket.socket)
        })
        outputSockets.forEach(socket => {
          node.addOutput(
            new Rete.Output(socket.socket, socket.name, socket.type)
          )
        })
        lastOutputSockets = outputSockets
      }
    }

    storageProvider.onData = (value: string) => {
      node.data.storage = value
      configureNode()
    }

    if (!node.data.storage) node.data.storage = storageProviders[0]
    configureNode()
    return node
  }
  /**
   * Worker method that performs the main logic of the component, uploading the base64 files to the selected storage provider.
   * @param node - The worker data for the current node.
   * @param inputs - The current inputs of the node.
   * @returns An object containing the resulting conversation string.
   */
  async worker(
    node: ExtendedWorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const logger = getLogger()

    // get completion providers for storage and upload categories
    const completionProviders = pluginManager.getCompletionProviders(
      'storage',
      ['upload']
    ) as CompletionProvider[]
    const storageProvider = node.data.storage as string
    // get the provider for the selected storage provider
    const provider = completionProviders.find(provider =>
      provider.models.includes(storageProvider)
    ) as CompletionProvider

    const completionHandler = provider.handler

    if (!completionHandler) {
      logger.error('No completion handler found for provider', provider)
      throw new Error('ERROR: Storage completion handler undefined')
    }

    node.data.files = []
    const files = inputs['files'][0] as string[]

    // convert base64 files to Uint8Arrays
    for (let i = 0; i < files.length; i++) {
      const base64File = files[i]
      const buffer = Uint8Array.from(atob(base64File), c => c.charCodeAt(0))
      node.data.files.push(buffer)
    }

    const { success, result, error } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })
    if (!success) {
      throw new Error('ERROR: ' + error)
    }
    return {
      urls: result as string[],
    }
  }
}
