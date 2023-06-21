// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers'
import { Application, app } from '@magickml/server-core'
import type { Api, ApiQuery } from './api.schema'

export type { Api, ApiQuery }

/** Interface for API Service Options */
export interface ApiServiceOptions {
  app: Application
}

/** Type for API Params */
export type ApiParams = Params<ApiQuery>

/** Type for API GET Response */
export type ApiGetResponse = {
  result: Object
}

/**
 * This is a skeleton for a custom service class. Remove or add the methods you need here.
 * Class to handle API services.
 * Implements ServiceInterface to integrate with FeathersJS.
 */
export class ApiService<ServiceParams extends ApiParams = ApiParams>
  implements ServiceInterface<Api, ServiceParams>
{
  /**
   * Constructs an instance of ApiService.
   * @param options - The options for the ApiService.
   */
  constructor(public options: ApiServiceOptions) {}

  /**
   * Handles the CREATE operation for the ApiService.
   * @param data - The data to create the new Api resource.
   * @param params - Optional service parameters.
   * @returns a Promise resolving to the created Api resources or error message.
   */
  // async create(data: ApiData, params?: ServiceParams): Promise<Api>
  // async create(data: ApiData[], params?: ServiceParams): Promise<Api[]>
  async create(
    data: any,
    params: ServiceParams
  ): Promise<Api | any /* TODO: type me */> {
    // const { id, content, apiKey } = data as any

    // // Return error if id is not specified.
    // if (!id) {
    //   return {
    //     error: 'The `id` field is required',
    //   }
    // }

    // // Return error if apiKey is not specified.
    // if (!apiKey) {
    //   return {
    //     error: 'The `apiKey` field is required',
    //   }
    // }

    // // Return error if content is not specified.
    // if (!content) {
    //   return {
    //     error:
    //       'The `content` field is required. if you want to pass an object, stringify it first',
    //   }
    // }

    // console.log('data is', data)

    // // Get the agent service.
    // const agentService = this.options.app.service('agents')

    // // Get the agent by id.
    // const agent = await agentService.get(id)

    // const agentRestApiKey = agent?.data?.rest_api_key

    // // Return error if the provided apiKey doesn't match the expected apiKey.
    // if (agentRestApiKey !== apiKey) {
    //   return {
    //     error: 'The `apiKey` is invalid',
    //   }
    // }

    // // Get the root spell of the selected agent.
    // const rootSpell = agent.rootSpell ?? {
    //   id: `no rootspell present for agent ${agent.name}`,
    // }

    // const agentManager = new AgentManager(app)

    // // create a new Agent
    // const newAgent = new Agent(
    //   {
    //     id: agent.id,
    //     rootSpell,
    //     name: agent.name,
    //     projectId: agent.projectId,
    //     secrets: agent.secrets,
    //     publicVariables: agent.publicVariables,
    //   },
    //   agentManager,
    //   app
    // )

    // const spell = await newAgent.spellManager.loadById(rootSpell.id)
    // console.log('spell loaded', spell)

    // // Run the root spell.
    // const result = await newAgent.spellManager.run({
    //   spellId: rootSpell.id,
    //   inputs: {
    //     'Input - REST API (POST)': {
    //       connector: 'REST API (POST)',
    //       content,
    //       sender: 'api',
    //       observer: agent.name,
    //       client: 'rest',
    //       channel: id,
    //       agentId: agent.id,
    //       entities: ['api', agent.name],
    //       channelType: 'POST',
    //       rawData: JSON.stringify({ data }),
    //     },
    //   },
    //   secrets: JSON.parse(agent.secrets ?? '{}'),
    //   publicVariables: agent.publicVariables,
    //   app,
    // })

    return {
      result: "5",
    }
  }
}

/** Helper function to get options for the ApiService. */
export const getOptions = (app: Application) => {
  return { app }
}
