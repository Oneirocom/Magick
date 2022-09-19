import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
  EngineContext,
} from '../../types'
import { EnkiThroughputControl } from '../../dataControls/EnkiThroughputControl'
import { ThothComponent } from '../../thoth-component'
const info = `Enki is a tool for building both fewshots, as well as entire data sets.  The enki component allows you to select an enki which you or someone else has made in the Enki tool and utilize it in your spells.

Due to current limitations in data structure, the enki inputs and outputs are unnamed, so you will have to know the order of them and what to use them for by referencing their usage in Enki.`

export class EnkiTask extends ThothComponent<
  Promise<Record<string, unknown> | null>
> {
  constructor() {
    // Name of the component
    super('Enki Task')

    this.task = {
      outputs: { trigger: 'option' },
    }
    this.category = 'AI/ML'
    this.display = true
    this.info = info
    this.deprecated = true
  }

  node = {}

  builder(node: ThothNode) {
    const EnkiOutput = new EnkiThroughputControl({
      socketType: 'stringSocket',
      taskType: 'output',
      nodeId: node.id,
    })

    node.inspector.add(EnkiOutput)

    return node
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { enkiCompletion } = thoth
    const taskName = node.data.name as string
    const completionResponse = await enkiCompletion(
      taskName,
      Object.values(inputs).map(
        (inputArray: string[]) => inputArray[0] as string
      )
    )

    // handle this better
    if (
      !completionResponse?.outputs ||
      completionResponse.outputs.length === 0
    ) {
      return null
    }

    const enkiOutputs = completionResponse.outputs.reduce(
      (compiledOutputs, output, outputNumber) => {
        compiledOutputs[`output${outputNumber + 1}`] = output
        return compiledOutputs
      },
      {} as { [output: string]: string }
    )

    if (!silent) node.display(Object.values(enkiOutputs).join(' '))

    return enkiOutputs
  }
}
