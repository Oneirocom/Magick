process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { stringSocket, triggerSocket, arraySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
const fewshot = `Given an action, detect what entities the player is interacting with. Ignore entities that the player is just asking about.
Entity types: food, person, creature, object, place, other, none
Action: throw an anvil at the man
Entities: anvil, man
Types: object (use), person (target)
Action: cast a fireball spell
Entities: none
Types: none
Action: convince the king to give you his kingdom
Entities: king, kingdom
Types: person (target), object (dialog)
Action: talk to the merchant
Entities: merchant
Types: person (target)
Action: ask where the bandit leader is
Entities: bandit leader
Types: person (dialog)
Action: leap over the chasm
Entities: chasm
Types: location (target)
Action: climb up the mountain
Entities: mountain
Types: location (target)
Action: throw a stone at the goblin
Entities: stone, goblin
Types: object (use), creature (target)
Action: run away from the orcs
Entities: orcs
Types: creature (target)
Action: ask how that relates to the dragon
Entities: none
Types: none
Action: ask the baker to give you a free loaf of bread
Entities: baker, loaf of bread
Types: person (target), food (dialog)
Action: get the merchant to give you better prices
Entities: merchant
Types: person (target)
Action: keep hiking
Entities: none
Types: none
Action: convince the bartender to give you the deed to his tavern
Entities: bartender, tavern deed
Types: person (target), object (dialog)
Action: go to the woman's home
Entities: woman's home
Types: location (target)
Action: ask the man for some water
Entities: man, water
Types: person (target), object (dialog)
Action: Jump onto your horse
Entities: horse
Types: creature (target)
Action: invent a new spell
Entities: none
Types: none
Action: ask the bartender for a machine gun
Entities: bartender, machine gun
Types: person (target), object (dialog)
Action: ask why the dragon attacked
Entities: dragon
Types: creature (dialog)
Action: cast a torchlight spell
Entities: none
Types: none
Action: ask where Zolarius the wizard is
Entities: Zolarius the wizard
Types: person (dialog)
Action: throw a pie at the waitress
Entities: pie, waitress
Types: food (use), person (target)
Action: ask where the wizard is
Entities: wizard
Types: person (dialog)
Action: draw your sword and fights the wolves
Entities: sword, wolves
Types: object (use), creature (target)
Action: `

const info = `The entity detector takes in an action as a string, and attempts to report any discrete entities are mentioned, and their general type.
The fewshot can be edited in the text edior, though note that the data structure must remian the same for proper processing.`

type Entity = {
  name: string
  type: string
}

type WorkerReturn = {
  entities: Entity[]
}

export class EntityDetector extends ThothComponent<
  Promise<any[] | WorkerReturn>
> {
  constructor() {
    // Name of the component
    super('Entity Detector')

    this.task = {
      outputs: {
        entities: 'output',
        trigger: 'option',
      },
      init: () => {},
      onRun: () => {},
    } as TaskOptions
    this.category = 'AI/ML'
    this.display = true
    this.info = info
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
    const out = new Rete.Output('entities', 'Entities', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const action = inputs['action'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + '\nEntities:'

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
          maxTokens: 50,
          stop: ['\n\n'],
        },
      }
    )

    const { success, choice } = resp.data
    const result = success ? (choice as string) : ''

    const split = result?.replace('\n', '')?.trim()?.split('Types: ')

    const [entities, types] = split
      ? split.map(item => item.split(', ').map(x => x.trim()))
      : [undefined, undefined]

    if (!entities || entities.length === 0) return []
    if (!types) return []

    for (let i = 0; i < entities.length; i++) {
      if (types[i]?.includes('(dialog)')) {
        types.splice(i, 1)
        entities.splice(i, 1)
      }
    }

    if (entities[0] === 'none') return []

    const allEntities = entities.map((entity, i) => ({
      name: entity,
      type: types[i],
    }))

    if (!silent) node.display(JSON.stringify(allEntities))

    return {
      entities: allEntities,
    }
  }
}
