// DOCUMENTED
import Rete from 'shared/rete'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { triggerSocket } from '../../sockets'
import {
  CompletionInspectorControls,
  CompletionProvider,
  CompletionSocket,
  EngineContext,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/** Information related to the TypeChat */
const info =
  'Takes a string input, a typescript inferfaces string input, and a response type string and generates an AI text completion which is output as an object.'

/** Type definition for the worker return */
type WorkerReturn = {
  result?: object
}

/**
 * TypeChat component responsible for generating text using any providers
 * available in Magick.
 */
export class TypeChat extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'TypeChat',
      {
        outputs: {
          result: 'output',
          trigger: 'option',
        },
      },
      'Data/Text',
      info
    )

    this.common = true
  }

  /**
   * Builder for TypeChat.
   * @param node - the MagickNode instance.
   * @returns a configured node with data generated from providers.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // get completion providers for the typeChat subtype
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'typeChat',
    ]) as CompletionProvider[]

    // get the models from the completion providers and flatten into a single array
    const models = completionProviders.map(provider => provider.models).flat()

    const modelName = new DropdownControl({
      name: 'Model Name',
      dataKey: 'model',
      values: models,
      defaultValue: models[0],
      tooltip: 'Choose model name',
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
   * Worker for processing the generated text.
   * @param node - the worker data.
   * @param inputs - worker inputs.
   * @param outputs - worker outputs.
   * @param context - engine context.
   * @returns an object with the success status and result or error message.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: {
      module: unknown
      secrets: Record<string, string>
      projectId: string
      context: EngineContext
    }
  ) {
    // get completion providers for the typeChat subtype
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'typeChat',
    ]) as CompletionProvider[]

    const model = (node.data as { model: string }).model as string
    // get the provider for the selected model
    console.log('model', model)
    const provider = completionProviders.find(provider =>
      provider.models.includes(model)
    ) as CompletionProvider
    const completionHandler = provider.handler

    if (!completionHandler) {
      console.error('No completion handler found for provider', provider)
      throw new Error('ERROR: Completion handler undefined')
    }

    const { success, result, error } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })
    console.log('result', result)
    if (!success) {
      throw new Error('ERROR: ' + error)
    }

    return {
      result: result as object,
    }
  }
}
