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

export class RequestNode extends AsyncNode {
  public static Description = new NodeDescription2({
    typeName: 'magick/request',
    category: NodeCategory.Action,
    label: 'Request',
    factory: (description, graph) => new RequestNode(description, graph),
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
      graph,
      'Request'
    )
  }

  override triggered(
    engine: Engine,
    triggeringSocketName: string,
    finished: () => void
  ): void {
    const method = ((this.readInput<string>('method') as string) || '')
      .toLowerCase()
      .trim()
    const headers = (this.readInput<string>('headers') as string) || {}
    const url = (this.readInput<string>('url') as string) || ''
    const params = this.readInput<string>('params') || {}

    axios({
      url,
      method,
      data: params,
      headers: headers,
    })
      .then((response: AxiosResponse<unknown>) => {
        const responseData = JSON.stringify(response.data)
        this.writeOutput('output', responseData)
        engine.commitToNewFiber(this, 'flow')
        finished()
      })
      .catch(error => {
        console.error('Request failed::::::::::::', error)
        throw new Error(`Request failed with (${error})!`)
      })
  }
}
