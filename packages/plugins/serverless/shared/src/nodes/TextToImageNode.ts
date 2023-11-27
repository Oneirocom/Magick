import {
  MagickComponent,
  CompletionProvider,
  CompletionSocket,
  EngineContext,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
  DataControl,
  pluginManager,
} from '@magickml/core'
import { makeServerlessCompletion } from '../functions/huggingface'
import {
  huggingFaceTaskTypes,
  huggingFaceNodeTooltip,
  getTriggerInputSocket,
  getTriggerOutputSocket,
  getTaskTypeControl,
  defaultModelsForTasks,
  modelControl,
} from './config'
import {
  getProvidersBySubtype,
  cameltoTitle,
  titleToCamel,
  handleSocketChange,
} from './utils'

/** Type definition for the worker return */
type WorkerReturn = {
  result?: any
}

/**
 * TextToImageNode component responsible for generating an image from text.
 */
export class TextToImageNode extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Text to Image',
      {
        outputs: {
          result: 'output',
          trigger: 'option',
        },
      },
      'AI',
      huggingFaceNodeTooltip
    )

    this.common = true
  }

  /**
   * Builder for the HuggingFace node.
   * @param node - the MagickNode instance.
   * @returns a configured node with data generated from providers.
   */
  builder(node: MagickNode) {
    // force set task type and model if not set
    // if (!node.data.taskType)
    //   node.data.taskType = cameltoTitle(huggingFaceTaskTypes[0])
    // if (!node.data.taskType)
    //   node.data.model = cameltoTitle(
    //     defaultModelsForTasks[huggingFaceTaskTypes[0]]
    //   )

    // // add trigger sockets
    // node.addInput(getTriggerInputSocket()).addOutput(getTriggerOutputSocket())

    // // task control
    // const taskType = getTaskTypeControl()

    // // get completion providers for by subtype
    // const completionProviders = pluginManager.getCompletionProviders(
    //   'huggingface',
    //   huggingFaceTaskTypes
    // ) as CompletionProvider[]

    // node.inspector.add(taskType)

    // //
    // let lastInspectorControls: any[] | undefined = []
    // let lastSockets: CompletionSocket[] | undefined = []

    // // Configure node when task type changes
    // const configureNode = () => {
    //   const task = titleToCamel(node.data.taskType as string)
    //   const provider = getProvidersBySubtype(task, completionProviders)
    //   const inspectorControls = provider?.inspectorControls ?? []
    //   const inputSockets = provider?.inputs ?? []
    //   const outputSockets = provider?.outputs ?? []

    //   // reset model for new default
    //   node.inspector.dataControls.delete(modelControl.dataKey)
    //   const modelInput = new modelControl.type({
    //     ...modelControl,
    //     defaultValue: defaultModelsForTasks[task] ?? modelControl.defaultValue,
    //   })
    //   node.inspector.add(modelInput)

    //   if (inspectorControls !== lastInspectorControls) {
    //     lastInspectorControls?.forEach((control: DataControl) => {
    //       node.inspector.dataControls.delete(control.dataKey)
    //     })
    //     inspectorControls.forEach(control => {
    //       const _control = new control.type({
    //         ...control,
    //         defaultValue: control.defaultValue,
    //       })
    //       // _control.onData = control.onData
    //       node.inspector.add(_control)
    //     })
    //     lastInspectorControls = inspectorControls
    //   }
    //   handleSocketChange(
    //     node,
    //     inputSockets,
    //     outputSockets,
    //     this.editor ?? undefined,
    //     lastSockets
    //   )

    //   const context = this.editor && this.editor.context
    //   if (!context) return
    //   const { sendToInspector } = context
    //   if (sendToInspector) {
    //     sendToInspector(node.inspector.data())
    //   }
    // }

    // taskType.onData = (value: string) => {
    //   configureNode()
    //   node.data.name = `Huggingface - ${cameltoTitle(value)}`
    // }

    // // Configure node when builder is called
    // configureNode()

    return node
  }

  /**
   * Worker for running HuggingFace inference.
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
    // const taskType = (node.data as { taskType: string }).taskType as string
    // const model = (node.data as { model: string }).model as string
    // const input = inputs['input']?.[0] as string

    // const { secrets } = context.module as {
    //   secrets: Record<string, string>
    //   projectId: string
    //   context: EngineContext
    // }

    // const { success, error, result } = await makeServerlessCompletion({
    //   provider: 'huggingface',
    //   task: taskType,
    //   inputs: input,
    //   token: secrets!['hf-access-token'],
    //   model,
    // })

    // if (!success && error) {
    //   throw new Error(error)
    // } else {
    //   return {
    //     result: result,
    //   }
    // }
    return { result: 'test' }
  }
}
