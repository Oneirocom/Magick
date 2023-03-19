/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  arraySocket,
  EngineContext,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  stringSocket,
  TaskOptions,
  triggerSocket,
} from '@magickml/engine'
import { Configuration, OpenAIApi } from 'openai'
import Rete from 'rete'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  result?: string
  error?: string
}

export class ChatCompletion extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Chat Completion')

    this.task = {
      outputs: {
        result: 'output',
        trigger: 'option',
      },
    } as TaskOptions
    this.category = 'AI/ML'
    this.info = info
  }
  // the builder is used to "assemble" the node component.

  builder(node: MagickNode): MagickNode {
    // system directive
    const system = new Rete.Input('system', 'System Directive', stringSocket)

    const conversation = new Rete.Input(
      'conversation',
      'Conversation History',
      arraySocket
    )

    const input = new Rete.Input('input', 'Input', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const result = new Rete.Output('result', 'Result', stringSocket)
    const error = new Rete.Output('error', 'Error', stringSocket)

    return node
      .addInput(triggerIn)
      .addInput(system)
      .addInput(conversation)
      .addInput(input)
      .addOutput(triggerOut)
      .addOutput(result)
      .addOutput(error)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: {
      module: any
      secrets: Record<string, string>
      projectId: string
      magick: EngineContext
    }
  ) {
    if (!context.module.secrets['openai_api_key']) {
      console.log('No OpenAI API key found')
      return { error: 'No OpenAI API key found' }
    }
    const messages: { role; content }[] = []

    const system = inputs['system']?.[0]
    if (system) {
      const systemMessage = { role: 'system', content: system }
      messages.push(systemMessage)
    }

    const conversation = inputs['conversation']?.[0] as any

    conversation?.rows?.forEach(event => {
      const message = { role: event.sender, content: event.content }
      messages.push(message)
    })

    const input = inputs['input']?.[0]
    if (input) {
      const userMessage = { role: 'user', content: input }
      messages.push(userMessage)
    } else {
      console.error('No input provided')
      return { error: 'No input provided' }
    }

    const configuration = new Configuration({ 
      apiKey: context.module.secrets['openai_api_key'],
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    console.log('completion.data', completion.data)

    const result = completion.data.choices[0].message?.content

    console.log('result', result)

    const string = JSON.stringify(result)

    return { result: string }
  }
}
