// DOCUMENTED
/**
 * A component to process Github Issue.
 * @category Github
 */
import Rete from 'shared/rete'
import {
  MagickComponent,
  stringSocket,
  triggerSocket,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
  WorkerData,
  objectSocket,
  MagickWorkerOutputs,
  getLogger,
} from '@magickml/core'

import axios from 'axios'

async function githubSearchIssue(token: string, query: string): Promise<any> {
  if (token == undefined || token == '' || token[0] != 'g') {
    return []
  }
  if (query == '') {
    return []
  }

  const url = `https://api.github.com/search/issues?q=${query}`
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }

  const logger = getLogger()
  return axios.get(url, { headers }).then(response => {
    if (response.data.items) {
      logger.debug('count: ' + response.data.items.length)

      const res = response.data.items.map(item => ({
        title: item.title,
        body: item.body,
        url: item.html_url,
      }))
      logger.debug(res)
      return res
    } else {
      logger.error('error to get')
      return []
    }
  })
}

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  object: []
  output: string
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class GithubIssueSearch extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Github Issue Search',
      {
        outputs: {
          output: 'output',
          object: 'object',
          trigger: 'option',
        },
      },
      'Integrations/Github',
      'Github Issue Search'
    )
  }

  /**
   * The builder function for the GithubIssueSearch node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const queryInput = new Rete.Input('query', 'Query', stringSocket, true)
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const issueOutput = new Rete.Output('object', 'Object', objectSocket)
    const textOutput = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(triggerInput)
      .addInput(queryInput)
      .addOutput(triggerOutput)
      .addOutput(issueOutput)
      .addOutput(textOutput)
  }

  /**
   * The worker function for the GithubIssueSearch node.
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - Node inputs.
   * @param {MagickWorkerOutputs} _outputs - Node outputs.
   * @returns An array containing the github issue
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    let query = ''
    if (inputs && inputs.query) {
      query = inputs.query[0] as string
    }
    const logger = getLogger()
    let token = ''
    if (context.module && context.module.secrets) {
      logger.debug(context.module.secrets)
      token = context.module.secrets['github_access_token']
    }
    logger.debug(token)

    const result = await githubSearchIssue(token, query)

    return {
      object: result,
      output: JSON.stringify(result),
    }
  }
}
