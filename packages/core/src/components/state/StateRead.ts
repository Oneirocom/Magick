import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { ThothComponent } from '../../magick-component'
const info = `The State Read component allows you to read values from the state.  These can be found in and are managed by the State Manager window.  This window consists of a JSON object.  You can define any number of outputs where an outputs name corresponds to a key in the state manager.  Whatever value is assigned to that key will be read ans passed into your graph.`
export class StateRead extends ThothComponent<
  Promise<Record<string, unknown>>
> {
  constructor() {
    // Name of the component
    super('State Read')

    this.task = {
      outputs: {},
    }
    this.category = 'State'
    this.workspaceType = 'spell'
    this.info = info
  }

  builder(node: ThothNode) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      name: 'Output sockets',
    })

    node.inspector.add(outputGenerator)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    _node: NodeData,
    _inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { magick }: { silent: boolean; magick: EngineContext }
  ) {
    const { getCurrentGameState } = magick

    try {
      const gameState = await getCurrentGameState()

      return gameState
    } catch (err) {
      throw new Error('Error in State Read component')
    }
  }
}
