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
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
const fewshot = (prose: string) => {
  const prompt = `Rewrite narrative snippets as a script:
1
Original text:
"I won't repeat what you're about to say," Professor Quirrell said, smiling.
They both laughed, then Harry turned serious again. "The Sorting Hat did seem to think I was going to end up as a Dark Lord unless I went to Hufflepuff," Harry said. "But I don't want to be one."
"Mr. Potter..." said Professor Quirrell. "Don't take this the wrong way. I promise you will not be graded on the answer. I only want to know your own, honest reply. Why not?"
Harry had that helpless feeling again. Thou shalt not become a Dark Lord was such an obvious theorem in his moral system that it was hard to describe the actual proof steps. "Um, people would get hurt?"
"Surely you've wanted to hurt people," said Professor Quirrell. "You wanted to hurt those bullies today. Being a Dark Lord means that people you want to hurt get hurt."
Harry floundered for words and then decided to simply go with the obvious. "First of all, just because I want to hurt someone doesn't mean it's right -"
"What makes something right, if not your wanting it?"
"Ah," Harry said, "preference utilitarianism."
"Pardon me?" said Professor Quirrell.
Rewritten as a script:
- Professor Quirrell: I won't repeat what you're about to say.
- Harry: The Sorting Hat did seem to think I was going to end up as a Dark Lord unless I went to Hufflepuff. But I don't want to be one.
- Professor Quirrell: Mr. Potter... Don't take this the wrong way. I promise you will not be graded on the answer. I only want to know your own, honest reply. Why not?
- Harry: Um, people would get hurt?
- Professor Quirrell: Surely you've wanted to hurt people. You wanted to hurt those bullies today. Being a Dark Lord means that people you want to hurt get hurt.
- Harry: First of all, just because I want to hurt someone doesn't mean it's right -
- Professor Quirrell: What makes something right, if not your wanting it?
- Harry: Ah, preference utilitarianism.
- Professor Quirrell: Pardon me?
2
Original text:
Quickly, he continued. "Nowadays, Mr. Bohlen, the hand-made article hasn't a hope. It can't possibly compete with mass-production, especially in this country — you know that. Carpets ... chairs ... shoes ...bricks ... crockery ... anything you like to mention — they're all made by machinery now. The quality may be inferior, but that doesn't matter. It's the cost of production that counts. And stories — well — they're just another product, like carpets and chairs, and no one cares how you produce them so long as you deliver the goods. We'll sell them wholesale, Mr. Bohlen! We'll undercut every writer in the country! We'll take the market!" 
"But seriously now, Knipe. D'you really think they'd buy them?" 
"Listen, Mr. Bohlen. Who on earth is going to want custom-made stories when they can get the other kind at half the price? It stands to reason, doesn't it?"
"And how will you sell them? Who will you say has written them?" 
Rewritten as a script:
- Knipe: Nowadays, Mr. Bohlen, the hand-made article hasn't a hope. It can't possibly compete with mass-production, especially in this country — you know that. Carpets ... chairs ... shoes ...bricks ... crockery ... anything you like to mention — they're all made by machinery now. The quality may be inferior, but that doesn't matter. It's the cost of production that counts. And stories — well — they're just another product, like carpets and chairs, and no one cares how you produce them so long as you deliver the goods. We'll sell them wholesale, Mr. Bohlen! We'll undercut every writer in the country! We'll take the market!
- Mr. Bohlen: But seriously now, Knipe. D'you really think they'd buy them?
- Knipe: Listen, Mr. Bohlen. Who on earth is going to want custom-made stories when they can get the other kind at half the price? It stands to reason, doesn't it?
- Mr. Bohlen: And how will you sell them? Who will you say has written them?
3
Original text:
${prose}
Rewritten as a script:
-`

  return prompt
}

const info = `The prose to script converter transforms narrative prose into a screenplay-style script, attributing dialog to characters in the scene, and discarding all text that is not speech. The input is a text string the output is a string of the script`

type WorkerReturn = {
  detectedItem: string
}

export class ProseToScript extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Prose to Script')

    this.task = {
      outputs: { detectedItem: 'output', trigger: 'option' },
      init: () => {},
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
    this.deprecated = true
    this.deprecationMessage =
      'This component has been deprecated. You can get similar functionality by using a generator with your own fewshots.'
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const out = new Rete.Output('script', 'Script', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    //const fewshotControl = new FewshotControl();

    //node.inspector.add(fewshotControl);

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
    { silent }: { silent: boolean }
  ) {
    const prose = inputs['string'][0] as string
    const prompt = fewshot(prose)

    const resp = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL ??
        import.meta.env.VITE_API_URL ??
        'https://localhost:8001'
      }/text_completion`,
      {
        params: {
          prompt: prompt,
          modelName: 'davinci',
          temperature: 0.0,
          maxTokens: 300,
          stop: ['\n'],
        },
      }
    )

    const { success, choice } = resp.data

    const result = success ? choice?.trim() : ''
    if (!silent) node.display(result)

    return {
      detectedItem: result,
    }
  }
}
