// DOCUMENTED 
/**
 * A simple rete component that returns the same output as the input.
 * @category Utility
 */
import Rete from 'rete';
import {
    MagickComponent,
    stringSocket,
    triggerSocket,
    MagickNode,
    ModuleContext,
    WorkerData,
    objectSocket
} from '@magickml/core';
import { Octokit } from '@octokit/rest';


async function githubSearchIssue (context: ModuleContext): Promise<any> {
    const { agent } = context.module;
    if (!agent) {
        return "Agent not found"
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { github } = agent;

    const token = github.token
    const query = github.query
    try {
        //@octokit/rest
        const octokit = new Octokit({
          auth: token
        })
  
        const searchResult = await octokit.search.issuesAndPullRequests({
          q: query,
          per_page: 100,
          page: 10
        })
  
        console.log("search result", searchResult)
  
        return searchResult
    } catch (error) {
        console.error(error)
        return []
    }
}


/**
 * The return type of the worker function.
 */
type WorkerReturn = {
    output: Record<string, any>;
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class GithubIssueSearch extends MagickComponent<Promise<WorkerReturn>> {

    constructor() {
        super('Github Issue Search', {
            outputs: {
                output: 'output',
                trigger: 'option',
            },
        }, 'Github', 'Joins the vc of the user who triggered the command');
    }

    /**
     * The builder function for the Echo node.
     * @param node - The node being built.
     * @returns The node with its inputs and outputs.
     */
    builder(node: MagickNode) {
        const triggerInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
        const tokenInput = new Rete.Input('token', 'Token', stringSocket, true)
        const queryInput = new Rete.Input('query', 'Query', stringSocket, true)
        const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
        const issueOutput = new Rete.Output('object', 'Object', objectSocket)

        return node
            .addInput(triggerInput)
            .addInput(tokenInput)
            .addInput(queryInput)
            .addOutput(triggerOutput)
            .addOutput(issueOutput)
    }

    /**
     * The worker function for the Echo node.
     * @param node - The node being worked on.
     * @param inputs - The inputs of the node.
     * @param _outputs - The unused outputs of the node.
     * @returns An object containing the same string as the input.
     */
    async worker(
        node: WorkerData,
    ): Promise<WorkerReturn> {

        const tool_desc = {
            title: 'Search Issue',
            body: 'Search Issue in github',
            id: node.id,
            action: githubSearchIssue.toString(),
            function_name: 'githubSearchIssue',
            keyword: 'Search Issue',

        }

        return {
            output: tool_desc
        }
    }
}