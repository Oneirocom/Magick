// TODO: Currently array variable is not working. Need to fix this.
import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, MagickWorkerOutputs, WorkerData } from '../../types'

const info = `Decides which system to use`

function chooseSystem(query) {
    // Define criteria for choosing between ChatGPT and Wolfram Alpha
    const isFactBased = /who|what|when|where|why|how/gi.test(query);
    const isComplex = query.length > 20;
    const isTimeSensitive = /urgent|emergency|quick|fast/gi.test(query);
    const isExploratory = /explore|create|imagine|brainstorm/gi.test(query);
    const isMathematical = /calculate|formula|equation|scientific/gi.test(query);
    const isLanguageBased = /translate|summarize|paraphrase/gi.test(query);
    
    // Decide which system to use based on the criteria
    if (isFactBased || isTimeSensitive || isMathematical) {
      return 'Wolfram Alpha';
    } else if (isComplex || isExploratory || isLanguageBased) {
      return 'ChatGPT';
    } else {
      // If the query doesn't fit any of the above categories, use the system with the highest overall performance based on past performance data
      return 'Wolfram Alpha';
    }
  }

type InputReturn = {
  output: string
}

export class QuerySystem extends MagickComponent<InputReturn> {
  constructor() {
    super('QuerySystem')

    this.task = {
      outputs: {
        GPT: 'option',
        WolfRamAlpha: 'option',
      },
    }

    this.category = 'Code'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    const queryInput = new Rete.Input('query', 'Content', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const gpt = new Rete.Output('gpt', 'GPT', triggerSocket)
    const wolf = new Rete.Output('wolf', 'WolframAlpha', triggerSocket)
    return node
      .addInput(dataInput)
      .addInput(queryInput)
      .addOutput(gpt)
      .addOutput(wolf)

  }

  worker(node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs) {
    const content = (inputs['query'] && inputs['query'][0]) as string
    console.log(content);
    const system = chooseSystem(content)
    /* if (system == "ChatGPT") {
        this._task.closed = ['gpt']
      } else {
        this._task.closed = ['wolf']
      } */
      this._task.closed = ['gpt']
    return {
      output: system,
    }
  }
}
