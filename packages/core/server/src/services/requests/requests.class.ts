// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#database-services
 */
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { app } from '../../app'
import type { Application } from '../../declarations'
import type {
  Request,
  RequestData,
  RequestPatch,
  RequestQuery,
} from './requests.schema'

export type RequestParams = KnexAdapterParams<RequestQuery>

/**
 * By default calls the standard Knex adapter service methods but can be
 * customized with your own functionality.
 * @template ServiceParams - Extends the Params for better typing
 */
export class RequestService<
  ServiceParams extends Params = RequestParams
> extends KnexService<Request, RequestData, ServiceParams, RequestPatch> {
  /**
   * Remove Requests.
   * This function removes Requests from the database.
   * @param {string} id - The ID or IDs of the request(s) to remove, separated by the '&' character if multiple IDs are provided.
   * @returns {Promise<any>} - A Promise that resolves to the data of the removed requests.
   */
  // @ts-ignore
  async remove(id: string): Promise<any> {
    const ids = id.split('&')
    const db = app.get('dbClient')
    const res = await db.from('request').whereIn('id', ids).del()
    return res
  }
}

/**
 * Get options for the RequestService
 * @param app - the Application object
 * @returns KnexAdapterOptions for the RequestService
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'request',
  }
}
