// DOCUMENTED
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { documentSocket, imageSocket, stringSocket, triggerSocket } from '../../sockets'
import { CompletionInspectorControls, CompletionProvider, CompletionSocket, MagickNode, MagickWorkerInputs, MagickWorkerOutputs, ModuleContext, WorkerData } from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { pluginManager } from '../../plugin'

// Information about the component
const info =
  'Convert the base64 image into a PNG.'

type WorkerReturn = {
  url?: string
}

/**
 * EventsToConversation component, responsible for converting an array of events into a conversation string.
 */
export class Base64ToPNG extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component and its output sockets definition
    super(
      'Base64 To Image',
      {
        outputs: {
          url: 'output',
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
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // get completion providers for text and chat categories
    const completionProviders = pluginManager.getCompletionProviders('storage', [
      'upload',
    ]) as CompletionProvider[]

    // get the models from the completion providers and flatten into a single array
    const models = completionProviders.map(provider => provider.models).flat()

    const modelName = new DropdownControl({
      name: 'Model Name',
      dataKey: 'model',
      values: models,
      defaultValue: models[0],
    })

    node.inspector.add(modelName)

    node.addInput(dataInput).addOutput(dataOutput)

    let lastInputSockets: CompletionSocket[] | undefined = []
    let lastOutputSockets: CompletionSocket[] | undefined = []
    let lastInspectorControls: CompletionInspectorControls[] | undefined = []

    /**
     * Configure the provided node according to the selected model and provider.
     */
    const configureNode = () => {
      const model = node.data.model as string
      const provider = completionProviders.find(provider =>
        provider.models.includes(model)
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

    modelName.onData = (value: string) => {
      node.data.model = value
      configureNode()
    }

    if (!node.data.model) node.data.model = models[0]
    configureNode()
    return node
  }
  /**
   * Worker method that performs the main logic of the component, converting base64URI to Image string.
   * @param node - The worker data for the current node.
   * @param inputs - The current inputs of the node.
   * @returns An object containing the resulting conversation string.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    // Usage example
    const bucketName = 'sample-bucket';
    const fileName = 'your-file-name.jpg';
    // get completion providers for text and chat categories
    const completionProviders = pluginManager.getCompletionProviders('storage', [
      'upload',
    ]) as CompletionProvider[]
    const model = (node.data as { model: string }).model as string
    // get the provider for the selected model
    const provider = completionProviders.find(provider =>
      provider.models.includes(model)
    ) as CompletionProvider

    const completionHandler = provider.handler

    if (!completionHandler) {
      console.error('No completion handler found for provider', provider)
      throw new Error('ERROR: Completion handler undefined')
    }

    const base64Image = inputs['files'] as unknown as string

    //const buffer = Buffer.from(base64Image, 'base64');
    const buffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
    node.data.fileName = fileName
    node.data.bucketName = bucketName
    node.data.file = buffer
    const { success, result, error } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })
    return {
      url: result as string,
    }
  }
}
