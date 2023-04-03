import Rete from 'rete'

import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { anySocket, triggerSocket } from '../../sockets'
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

const info = 'Generate text using any of the providers available in Magick.'

type WorkerReturn = {
  success: boolean
  result?: string
  error?: string
}

export class GenerateText extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Generate Text', {
      outputs: {
        error: 'option',
        result: 'output',
        trigger: 'option',
      },
    }, 'Text', info)

  }

  builder(node: MagickNode) {
    const settings = new Rete.Input('settings', 'Settings', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const completionProviders = pluginManager.getCompletionProviders('text', [
      'text',
      'chat',
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

    const configureNode = () => {
      const model = node.data.model as string
      const provider = completionProviders.find(provider =>
        provider.models.includes(model)
      ) as CompletionProvider
      // node.data.provider = provider
      const inspectorControls = provider.inspectorControls
      const inputSockets = provider.inputs
      const outputSockets = provider.outputs
      const connections = node.getConnections()

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
      if (inputSockets !== lastInputSockets) {
        // remove connections to deleted sockets


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
      if (outputSockets !== lastOutputSockets) {
        lastOutputSockets?.forEach(socket => {
          if (node.outputs.has(socket.socket)) node.outputs.delete(socket.socket)
        })
        outputSockets.forEach(socket => {
          node.addOutput(new Rete.Output(socket.socket, socket.name, socket.type))
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
    node.addInput(settings)
    return node
  }

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
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'text',
      'chat',
    ]) as CompletionProvider[]

    const model = (node.data as {model: string}).model as string
    // get the provider for the selected model
    const provider = completionProviders.find(provider =>
      provider.models.includes(model)
    ) as CompletionProvider

    const completionHandler = provider.handler

    if (!completionHandler) {
      console.error('No completion handler found for provider', provider)
      return {
        success: false,
      }
    }

    const { success, result } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })

    if (!success) {
      return {
        success: false,
        result,
      }
    }

    return {
      success: true,
      result,
    }
  }
}
