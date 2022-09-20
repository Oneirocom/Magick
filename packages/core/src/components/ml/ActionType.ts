process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const fewshot = `Given an action classify the type of action it is

Types: look, get, use, craft, dialog, movement, travel, combat, consume, other

Action, Type: pick up the bucket, get
Action, Type: cast a fireball spell on the goblin, combat
Action, Type: convince the king to give you his kingdom, dialog
Action, Type: talk to the merchant, dialog
Action, Type: leap over the chasm, movement
Action, Type: climb up the mountain, travel
Action, Type: throw a stone at the goblin, combat
Action, Type: run away from the orcs, movement
Action, Type: ask the baker to give you a free loaf of bread, dialog
Action, Type: go to the forest, travel
Action, Type: grab a torch off the wall, get
Action, Type: throw your sword at the table, use
Action, Type: journey to the city, travel
Action, Type: drink your potion, use
Action, Type: `

const info = `The Action type component will take in an action as text, and attempt to classify it into a discrete number of categories:

look, get, use, craft, dialog, movement, travel, combat, consume, other.`

type WorkerReturn = {
  actionType: string
}

export class ActionTypeComponent extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Action Type Classifier')
    this.task = {
      outputs: { actionType: 'output', trigger: 'option' },
    }
    this.category = 'AI/ML'
    this.info = info
    this.display = true
    this.deprecated = true
    this.deprecationMessage =
      'This component has been deprecated. You can get similar functionality by using a generator with your own fewshots.'
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input('action', 'Action', stringSocket)
    const out = new Rete.Output('actionType', 'ActionType', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connsected components
  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const action = inputs['action'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + ','

    const resp = await axios.post(
      `${
        process.env.REACT_APP_API_URL ??
        process.env.API_URL ??
        'https://localhost:8001'
      }/text_completion`,
      {
        params: {
          prompt: prompt,
          modelName: 'davinci',
          temperature: 0.0,
          maxTokens: 100,
          stop: ['\n'],
        },
      }
    )

    let result = ''
    const { success, choice } = resp.data
    if (success) {
      result = choice?.trim()
      if (!silent) node.display(result)
    }

    return {
      actionType: result,
    }
  }
}
