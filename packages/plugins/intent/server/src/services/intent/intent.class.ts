// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers'
import { Agent, AgentManager } from '@magickml/agents'
import { Application, app } from '@magickml/server-core'
import type {
  Intent,
  IntentData,
  IntentPatch,
  IntentQuery,
} from './intent.schema'

export type { Intent, IntentData, IntentPatch, IntentQuery }

/** Interface for Intent Service Options */
export interface IntentServiceOptions {
  app: Application
}

/** Type for Intent Params */
export type IntentParams = Params<IntentQuery>

/** Type for Intent GET Response */
export type IntentGetResponse = {
  result: Object
}

/**
 * This is a skeleton for a custom service class. Remove or add the methods you need here.
 * Class to handle Intent services.
 * Implements ServiceInterface to integrate with FeathersJS.
 */
export class IntentService<ServiceParams extends IntentParams = IntentParams>
  implements ServiceInterface<Intent, IntentData, ServiceParams, IntentPatch>
{
  /**
   * Constructs an instance of IntentService.
   * @param options - The options for the IntentService.
   */
  constructor(public options: IntentServiceOptions) {}

  /**
   * Handles the GET operation for the IntentService.
   * @param id - The unique identifier for the resource.
   * @param _params - Optional service parameters.
   * @returns a Promise resolving to an IntentGetResponse or any error message.
   */
  async get(
    id: Id,
    _params?: ServiceParams
  ): Promise<IntentGetResponse | any /* TODO: remove */> {
    console.log('***** GET', id, _params)
    const { intentKey, content } = _params?.query as any // TODO: why is this error
    const app = this.options.app
    console.log('app', app)

    console.log('***** result', result)

    return {
      result,
    }
  }

  /**
   * Handles the CREATE operation for the ApiService.
   * @param data - The data to create the new Api resource.
   * @param params - Optional service parameters.
   * @returns a Promise resolving to the created Api resources or error message.
   */
  async create(data: ApiData, params?: ServiceParams): Promise<Api>
  async create(data: ApiData[], params?: ServiceParams): Promise<Api[]>
  async create(
    data: ApiData | ApiData[]
    // params: ServiceParams
  ): Promise<Api | any /* TODO: type me */> {
    return {
      result,
    }
  }

  /**
   * Handles the UPDATE operation for the ApiService.
   * @param id - The unique identifier for the resource to update.
   * @param data - The data for the update.
   * @returns a Promise resolving to the updated Api or error message.
   */
  async update(
    id: Id,
    data: ApiData
    // _params?: ServiceParams
  ): Promise<Api | any> {
    const { content, apiKey } = data as any

    return {
      result,
    }
  }

  /**
   * Handles the REMOVE operation for the ApiService.
   * @param id - The unique identifier for the resource to delete.
   * @param _params - Optional service parameters.
   * @returns a Promise resolving to the deleted Api or error message.
   */
  async remove(id: Id, _params?: ServiceParams): Promise<Intent | any> {
    const { content, apiKey } = _params?.query as any

    return {
      result,
    }
  }
}

/** Helper function to get options for the ApiService. */
export const getOptions = (app: Application) => {
  return { app }
}
