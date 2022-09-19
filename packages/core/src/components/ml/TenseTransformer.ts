// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'
import { NodeData } from 'rete/types/core/data'
import {
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
  EngineContext,
} from '../../types'

import { FewshotControl } from '../../dataControls/FewshotControl'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const fewshot = `Change each statement to be in the third person present tense and correct all grammar.
Matt: am sleepy.
Third Person: Matt is sleepy.
---
Matt: bllogha bloghs.
Third Person: Matt makes nonsensical sounds.
--
Jackson: tell the king that you won't help him.
Third Person: Jackson tells the king that he won't help him.
---
Jill: can I have a mug of ale?
Third Person: Jill says, "Can I have a mug of ale?"
---
Sam: say i'd be happy to help you
Third Person: Sam says, "I'd be happy to help you."
---
Cogsworth: draw my sword of light and slice myself in the forehead.
Third Person: Cogsworth draws his sword of light and slices himself in the forehead.
---
Jon: say but you said I could have it. Please?
Third Person: Jon says, "But you said I could have it. Please?"
---
Eliza: ask my friend where he's going
Third Person: Eliza asks her friend where he's going.
---
Aaron: am sleepy.
Third Person: Aaron is sleepy.
---
Robert: say I think I can resist it if you give me potion of Mind Shield. Do u have one?
Third Person: Robert says, "I think I can resist it if you give me a potion of Mind Shield. Do you have one?"
---
Jack: go talk to the knight
Third Person: Jack goes to talk to the knight
---
Jack: say What are you doing?!
Third Person: Jack says, "What are you doing?!"
---
James: I'm confident that I can kill the dragon!
Third Person: James says, "I'm confident that I can kill the dragon!"
---
Erica: want to go to the store but trip over my own shoes.
Third Person: Erica wants to go to the store but she trips over her own shoes.
---
Tom: told her that it was over.
Third Person: Tom told her that it was over.
---
Fred: ask what time is it?
Third Person: Fred asks, "What time is it?"
---
James: okay!
Third Person: James says, "Okay!"
--
Fred: command the mercenaries to attack the dragon while you rescue the princess.
Third Person: Fred commands the mercenaries to attack the dragon while he rescues the princess.
---
`

const info = `The Tense Transformer will take any string and attempt to turn it into the first person present tense.  It requires a name and text as an input, and will output the result.
You can edit the fewshot in the text editor, but be aware that you must retain the fewshots data structure so processing will work.`

type WorkerReturn = {
  action: string
}
export class TenseTransformer extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Tense Transformer')

    this.task = {
      outputs: {
        action: 'output',
        trigger: 'option',
      },
    }

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
    // Set fewshot into nodes data
    if (!node.data.fewshot) node.data.fewshot = fewshot
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const textInput = new Rete.Input('text', 'Text', stringSocket)
    const nameInput = new Rete.Input('name', 'Name', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('action', 'Action', stringSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(dataInput)
      .addInput(textInput)
      .addInput(nameInput)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    // ADD ON INPUT
    const { name, text } = inputs
    const prompt = `${node.data.fewshot}${name[0]}: ${text[0]}\nThird Person:`

    const body = {
      prompt,
      stop: ['\n'],
      maxTokens: 100,
      temperature: 0.0,
      model: 'vanilla-davinci',
    }

    //const { success, choice } = resp.data

    //const result = success ? choice?.trim() : ''

    //if (!silent) node.display(result)

    return {
      action: '', //result,
    }
  }
}
