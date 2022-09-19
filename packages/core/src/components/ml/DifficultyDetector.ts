import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
  EngineContext,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
// For simplicity quests should be ONE thing not complete X and Y
const fewshot = `Given an action, predict how hard it would be for a normal human in a fantasy world and what type of stat it uses.

Stat Types: strength, dexterity, endurance, intelligence, charisma

Action, Difficulty, Type: throw an anvil at the man, 8/20, strength
Action, Difficulty, Type: cast a fireball spell, 6/20, intelligence
Action, Difficulty, Type: I'm confident that I can kill the dragon! 2/20, charisma
Action, Difficulty, Type: convince the king to give you his kingdom, 13/20, charisma
Action, Difficulty, Type: talk to the merchant, 1/20, charisma
Action, Difficulty, Type: ask the man if you can jump on his back and ride him around, 11/20, charisma
Action, Difficulty, Type: pick up the mountain, 20/20, strength
Action, Difficulty, Type: enter the room and tell the governor that you'll slay the dragon, 4/20, charisma
Action, Difficulty, Type: run away, 4/20, dexterity
Action, Difficulty, Type: ask why the dragon has been attacking people, 2/20, charisma
Action, Difficulty, Type: say something wise, 6/20, intelligence
Action, Difficulty, Type: sees a massive dragon flying over head, 7/20, Luck
Action, Difficulty, Type: attack the Dragon, 6/20, strength
Action, Difficulty, Type: continue harder and harder, 6/20, endurance
Action, Difficulty, Type: feel pity for the gnome, 1/20, charisma
Action, Difficulty, Type: set up a small blanket and pour the dragon a drink, 2/20, dexterity
Action, Difficulty, Type: says "wait are you leaving me?", 2/20, charisma
Action, Difficulty, Type: leap over the chasm, 7/20, dexterity
Action, Difficulty, Type: talk to the bartender who gives you a pile of gold, 11/20, Luck
Action, Difficulty, Type: climb up the mountain, 6/20, endurance
Action, Difficulty, Type: goes to talk to the king, 2/20, charisma
Action, Difficulty, Type: ask who the evil demon king is, 2/20, charisma
Action, Difficulty, Type: do a back flip, 6/20, dexterity
Action, Difficulty, Type: `

const info = `The difficulty detector will attempt to tell you the difficulty of an action out of 20 in the format 5/20, as well as the stat category.  The categories it will attempt to classify the action into are:

strength, dexterity, endurance, intelligence, charisma

You can also view and edit the fewshot in the text editor.  Note however that you must keep the same data format for the component to properly format the completion response.
`

type WorkerReturn = {
  difficulty: string | undefined
  category: string | undefined
}

export class DifficultyDetectorComponent extends ThothComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    // Name of the component
    super('Difficulty Detector')

    this.task = {
      outputs: { difficulty: 'output', category: 'output', trigger: 'option' },
    }
    this.category = 'AI/ML'
    this.info = info
    this.display = true
    this.deprecated = true
  }

  displayControl = {}

  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot
    const inp = new Rete.Input('action', 'Action', stringSocket)
    const difficultyOut = new Rete.Output(
      'difficulty',
      'Difficulty',
      stringSocket
    )

    const categoryOut = new Rete.Output('category', 'Category', stringSocket)

    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(triggerInput)
      .addOutput(triggerOutput)
      .addOutput(difficultyOut)
      .addOutput(categoryOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { completion } = thoth
    const action = inputs['action'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + ','

    const body = {
      prompt,
      stop: ['\n'],
      maxTokens: 100,
      temperature: 0.0,
    }
    try {
      const raw = (await completion(body)) as string
      const result = raw?.trim()
      if (!silent) node.display(result)

      const [difficulty, category] = result
        ? result.split(', ')
        : [undefined, undefined]

      return {
        difficulty,
        category,
      }
    } catch (err) {
      throw new Error('Error in Difficulty Detector component')
    }
  }
}
