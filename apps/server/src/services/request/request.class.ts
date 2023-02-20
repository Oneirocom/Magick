// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Request, RequestData, RequestPatch, RequestQuery } from './request.schema'

export interface RequestParams extends KnexAdapterParams<RequestQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RequestService<ServiceParams extends Params = RequestParams> extends KnexService<
  Request,
  RequestData,
  ServiceParams,
  RequestPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'request'
  }
}
