import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { stringSocket, triggerSocket, booleanSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const fewshot = `Rate the actions according to the following content categories
X: Explicit sexual content, rape, cannibalism, incest
M: Heavy violence, light sexual content, safe for adults
T: Light violence, safe for teens.
E: Safe for everyone

Action: dodge and fire a silver arrow.
Rating: E

Action: Kiss her chest
Rating: M

Action: Cum in the pig's mouth
Rating: X

Action: Lick the woman's pussy
Rating: X

Action: Behead the peasant with your axe
Rating: M

Action: pull out elon musks not a flamethrower to burn the dragon
Rating: T

Action: melt gold in cave and cover dragon with the melted gold
Rating: T

Action: Laughed you figured your sister and fucked your best friend.
Rating: X

Action: pick up governor and toss him out the window like from the emperors groove, with him screaming SORRRY
Rating: T

Action: Rub the woman's genitals
Rating: X

Action: Stroke the persons boobs
Rating: X

Action: Pick up the bartender
Rating: T

Action: Ask the guard why he's here.
Rating: E

Action: Release the biggest load in the universe
Rating: X

Action: Cast a spell to summon a fireball
Rating: T

Action: Have sex with her
Rating: X

Action: Take out my flamethrower
Rating: T

Action: Slice off the bandit's head
Rating: M

Action: Jerk off
Rating: X

Action: `

const info = `The Safety Verifier component takes a string and attempts to classify if that string is safe or not.  It returns a boolean value that represents whether or not the input is safe.

The fewshot can be edited in the text editor, however it contains content which may be triggering to some individuals. If you modify the fewshot, note that it must remain in the format for the processing to work.`

type WorkerReturn = {
  boolean: boolean
}

export class SafetyVerifier extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Safety Verifier')

    this.task = {
      outputs: {
        trigger: 'option',
        boolean: 'output',
      },
    }
    this.category = 'AI/ML'
    this.display = true
    this.info = info
    this.deprecated = true
    this.deprecationMessage =
      'This component has been deprecated. You can get similar functionality by using a generator with your own fewshots.'
  }

  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'Text', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('boolean', 'Boolean', booleanSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { completion } = thoth
    const action = inputs['string'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + '\nRating:'

    const body = {
      prompt,
      stop: ['\n'],
      maxTokens: 10,
      temperature: 0.0,
    }
    try {
      const raw = (await completion(body)) as string
      const result = raw?.trim() !== 'X'

      if (!silent) node.display(`${result}`)

      return {
        boolean: result,
      }
    } catch (err) {
      throw new Error('Error in Safety Verifier component')
    }
  }
}
