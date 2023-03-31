// DOCUMENTED 
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers';
import { runSpell } from '@magickml/engine';
import { Application } from '@magickml/server-core';
import type { Api, ApiData, ApiPatch, ApiQuery } from './api.schema';

export type { Api, ApiData, ApiPatch, ApiQuery };

/** Interface for API Service Options */
export interface ApiServiceOptions {
  app: Application;
}

/** Type for API Params */
export type ApiParams = Params<ApiQuery>;

/** Type for API GET Response */
export type ApiGetResponse = {
  // eslint-disable-next-line @-eslint/ban-types
  result: Object;
};

/**
 * This is a skeleton for a custom service class. Remove or add the methods you need here.
 * Class to handle API services.
 * Implements ServiceInterface to integrate with FeathersJS.
 */
export class ApiService<ServiceParams extends ApiParams = ApiParams>
  implements ServiceInterface<Api, ApiData, ServiceParams, ApiPatch> {
  /**
   * Constructs an instance of ApiService.
   * @param options - The options for the ApiService.
   */
  constructor(public options: ApiServiceOptions) {}

  /**
   * Handles the GET operation for the ApiService.
   * @param id - The unique identifier for the resource.
   * @param _params - Optional service parameters.
   * @returns a Promise resolving to an ApiGetResponse or any error message.
   */
  async get(
    id: Id,
    _params?: ServiceParams
  ): Promise<ApiGetResponse | any /* TODO: remove */> {
    const { apiKey, content } = _params?.query as any; // TODO: why is this error
    
    // Return error if apiKey is not specified.
    if (!apiKey) {
      return {
        error: 'The `apiKey` field is required',
      };
    }

    // Return error if content is not specified.
    if (!content) {
      return {
        error:
          'The `content` field is required. if you want to pass an object, stringify it first',
      };
    }

    // Get the agent service.
    const agentService = this.options.app.service('agents');
    
    // Get the agent by id.
    const agent = await agentService.get(id);

    const agentRestApiKey = agent?.data?.rest_api_key;

    // Return error if the provided apiKey doesn't match the expected apiKey.
    if (agentRestApiKey !== apiKey) {
      return {
        error: 'The `apiKey` is invalid',
      };
    }

    // Get the root spell of the selected agent.
    const rootSpell = agent.rootSpell ?? {id: `no rootspell present for agent ${agent.name}`};

    // Run the root spell.
    const result = await runSpell({
      spellId: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (GET)': {
          content,
          sender: 'api',
          observer: agent.name,
          client: 'rest',
          channelType: 'GET',
          agentId: agent.id,
          entities: ['api', agent.name],
          channel: id,
        },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    });

    return {
      result,
    };
  }

  /**
   * Handles the CREATE operation for the ApiService.
   * @param data - The data to create the new Api resource.
   * @param params - Optional service parameters.
   * @returns a Promise resolving to the created Api resources or error message.
   */
  async create(data: ApiData, params?: ServiceParams): Promise<Api>;
  async create(data: ApiData[], params?: ServiceParams): Promise<Api[]>;
  async create(
    data: ApiData | ApiData[],
    params: ServiceParams
  ): Promise<Api | any /* TODO: type me */> {
    const { id, content, apiKey } = data as any;

    // Return error if id is not specified.
    if (!id) {
      return {
        error: 'The `id` field is required',
      };
    }

    // Return error if apiKey is not specified.
    if (!apiKey) {
      return {
        error: 'The `apiKey` field is required',
      };
    }

    // Return error if content is not specified.
    if (!content) {
      return {
        error:
          'The `content` field is required. if you want to pass an object, stringify it first',
      };
    }

    // Get the agent service.
    const agentService = this.options.app.service('agents');
    
    // Get the agent by id.
    const agent = await agentService.get(id);

    const agentRestApiKey = agent?.data?.rest_api_key;

    // Return error if the provided apiKey doesn't match the expected apiKey.
    if (agentRestApiKey !== apiKey) {
      return {
        error: 'The `apiKey` is invalid',
      };
    }

    // Get the root spell of the selected agent.
    const rootSpell = agent.rootSpell ?? {id: `no rootspell present for agent ${agent.name}`};

    // Run the root spell.
    const result = await runSpell({
      spellId: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (POST)': {
          content,
          sender: 'api',
          observer: agent.name,
          client: 'rest',
          channel: id,
          agentId: agent.id,
          entities: ['api', agent.name],
          channelType: 'POST',
        },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    });

    return {
      result,
    };
  }

  /**
   * Handles the UPDATE operation for the ApiService.
   * @param id - The unique identifier for the resource to update.
   * @param data - The data for the update.
   * @param _params - Optional service parameters.
   * @returns a Promise resolving to the updated Api or error message.
   */
  async update(
    id: Id,
    data: ApiData,
    _params?: ServiceParams
  ): Promise<Api | any> {
    const { content, apiKey } = data as any;

    // Return error if id is not specified.
    if (!id) {
      return {
        error: 'The `id` parameter is required',
      };
    }

    // Return error if apiKey is not specified.
    if (!apiKey) {
      return {
        error: 'The `apiKey` field is required',
      };
    }

    // Return error if content is not specified.
    if (!content) {
      return {
        error:
          'The `content` field is required. if you want to pass an object, stringify it first',
      };
    }

    // Get the agent service.
    const agentService = this.options.app.service('agents');
    
    // Get the agent by id.
    const agent = await agentService.get(id);

    const agentRestApiKey = agent?.data?.rest_api_key;

    // Return error if the provided apiKey doesn't match the expected apiKey.
    if (agentRestApiKey !== apiKey) {
      return {
        error: 'The `apiKey` is invalid',
      };
    }

    // Get the root spell of the selected agent.
    const rootSpell = agent.rootSpell ?? {id: `no rootspell present for agent ${agent.name}`};

    // Run the root spell.
    const result = await runSpell({
      spellId: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (PUT)': {
          content,
          sender: 'api',
          observer: agent.name,
          client: 'rest',
          channel: id,
          agentId: agent.id,
          entities: ['api', agent.name],
          channelType: 'PUT',
        },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    });

    return {
      result,
    };
  }

  /**
   * Handles the REMOVE operation for the ApiService.
   * @param id - The unique identifier for the resource to delete.
   * @param _params - Optional service parameters.
   * @returns a Promise resolving to the deleted Api or error message.
   */
  async remove(id: Id, _params?: ServiceParams): Promise<Api | any> {
    const { content, apiKey } = _params?.query as any;
    
    // Return error if id is not specified.
    if (!id) {
      return {
        error:
          'The `id` parameter is required. It should be formatted like /api/<id>',
      };
    }

    // Return error if apiKey is not specified.
    if (!apiKey) {
      return {
        error: 'The `apiKey` field is required',
      };
    }

    // Get the agent service.
    const agentService = this.options.app.service('agents');
    
    // Get the agent by id.
    const agent = await agentService.get(id);

    const agentRestApiKey = agent?.data?.rest_api_key;

    // Return error if the provided apiKey doesn't match the expected apiKey.
    if (agentRestApiKey !== apiKey) {
      return {
        error: 'The `apiKey` is invalid',
      };
    }

    // Get the root spell of the selected agent.
    const rootSpell = agent.rootSpell ?? {id: `no rootspell present for agent ${agent.name}`};

    // Run the root spell.
    const result = await runSpell({
      spellId: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (DELETE)': {
          content,
          sender: 'api',
          observer: agent.name,
          client: 'rest',
          channel: id,
          agentId: agent.id,
          entities: ['api', agent.name],
          channelType: 'DELETE',
        },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    });

    return {
      result,
    };
  }
}

/** Helper function to get options for the ApiService. */
export const getOptions = (app: Application) => {
  return { app };
};