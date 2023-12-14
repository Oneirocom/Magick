import {
  Engine,
  Socket,
  NodeDescription,
  NodeDescription2,
  AsyncNode,
  IGraph,
  NodeCategory,
} from '@magickml/behave-graph'
import axios, { AxiosResponse } from 'axios'

export class FetchNode extends AsyncNode {
  public static Description = new NodeDescription2({
    typeName: 'magick/fetch',
    category: NodeCategory.Action,
    label: 'Fetch',
    factory: (description, graph) => new FetchNode(description, graph),
  })

  constructor(description: NodeDescription, graph: IGraph) {
    super(
      description,
      graph,
      [
        new Socket('flow', 'flow'),
        new Socket('string', 'method'),
        new Socket('string', 'headers'),
        new Socket('string', 'url'),
        new Socket('string', 'params'),
      ],
      [new Socket('flow', 'flow'), new Socket('string', 'output')],
      {},
      'FetchNode'
    )
  }

  override async triggered(
    engine: Engine,
    triggeringSocketName: string,
    finished: () => void
  ): Promise<void> {
    const method = ((this.readInput<string>('method') as string) || '')
      .toLowerCase()
      .trim()
    const headers = (this.readInput<string>('headers') as string) || {}
    const url = (this.readInput<string>('url') as string) || ''
    const params = this.readInput<string>('params') || {}

    try {
      const response: AxiosResponse<unknown> = await axios({
        url,
        method,
        data: params,
        headers: headers,
      })

      const responseData = JSON.stringify(response.data)

      this.writeOutput('output', responseData)
      engine.commitToNewFiber(this, 'flow')
      finished()
    } catch (error) {
      console.error('Request failed::::::::::::', error)
      throw new Error(`Request failed with (${error})!`)
    }
  }
}
