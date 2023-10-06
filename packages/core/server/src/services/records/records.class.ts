import type { Id, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { RecordSchema } from '@magickml/core'
import type { RecordData, RecordPatch, RecordQuery } from './records.schema'

// Define RecordParams type based on KnexAdapterParams with RecordQuery
export type RecordParams = KnexAdapterParams<RecordQuery>

/**
 * Default RecordService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class RecordService<
  ServiceParams extends Params = RecordParams
> extends KnexService<RecordSchema, RecordData, ServiceParams, RecordPatch> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  async create(
    data: RecordData | RecordData[] | any,
    params?: ServiceParams
  ): Promise<RecordSchema | RecordSchema[] | any> {
    return await super.create(data, params)
  }

  async find(params?: ServiceParams): Promise<any> {
    if (params?.query?.collectionId) {
      params.query.collectionId = params.query.collectionId
    }

    if (params?.query?.ids) {
      params.query.id = { $in: params.query.ids }
      delete params.query.ids
    }

    return await super.find(params)
  }

  async patch(
    id: Id | null,
    data: RecordPatch,
    params?: ServiceParams
  ): Promise<any> {
    if (params?.query?.ids) {
      const idsToUpdate = params.query.ids
      delete params.query.ids

      const patchPromises = idsToUpdate.map((updateId: Id) =>
        super.patch(updateId, data, params)
      )
      return await Promise.all(patchPromises)
    }

    return await super.patch(id, data, params)
  }

  async remove(id: Id | null, params?: ServiceParams): Promise<any> {
    if (params?.query?.ids) {
      const idsToRemove = params.query.ids
      delete params.query.ids

      const removePromises = idsToRemove.map((removeId: Id) =>
        super.remove(removeId, params)
      )
      return await Promise.all(removePromises)
    }

    return await super.remove(id, params)
  }
}

/**
 * Returns options needed to initialize the RecordService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'records',
    multi: ['remove'],
  }
}
