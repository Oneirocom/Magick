// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params } from '@feathersjs/feathers'
import {
  KnexAdapterOptions,
  KnexAdapterParams,
  KnexService,
} from '@feathersjs/knex/lib'

import type { Application } from '../../declarations'
import type {
  Datasets,
  DatasetsData,
  DatasetsPatch,
  DatasetsQuery,
} from './datasets.schema'
import { app } from '../../app'

export type { Datasets, DatasetsData, DatasetsPatch, DatasetsQuery }

type DatasetsParams = KnexAdapterParams<DatasetsQuery>

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class DatasetsService<
  ServiceParams extends Params = DatasetsParams
> extends KnexService<Datasets, DatasetsData, ServiceParams, DatasetsPatch> {
  async find(params?: ServiceParams) {
    console.log('invoking find')
    const openAIFiledId = params?.query?.openaiFileId
    if (openAIFiledId) {
      console.log('invoking find with fileId')
      const db = app.get('dbClient')
      const result = await db('datasets').where({ openAIFiledId }).first()
      return result
    }
    console.log(params)
    return super.find(params)
  }

  async get(id: Id, params?: ServiceParams): Promise<Datasets> {
    console.log('invoking get')
    return super.get(id, params)
  }

  async create(data: DatasetsData, params?: ServiceParams): Promise<Datasets>
  async create(
    data: DatasetsData[],
    params?: ServiceParams
  ): Promise<Datasets[]>
  async create(
    data: DatasetsData | DatasetsData[],
    params?: ServiceParams
  ): Promise<Datasets | Datasets[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }
    console.log({ createData: data })
    return super.create(data, params)
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(
    id: NullableId,
    data: DatasetsData,
    params?: ServiceParams
  ): Promise<Datasets> {
    return super.update(id, data, params)
  }
  patch(
    id: NullableId,
    data: DatasetsPatch,
    params?: ServiceParams
  ): Promise<Datasets>
  patch(
    id: NullableId,
    data: DatasetsPatch,
    params?: ServiceParams
  ): Promise<Datasets[]>
  async patch(
    id: NullableId,
    data: DatasetsPatch,
    params?: ServiceParams
  ): Promise<Datasets | Datasets[]> {
    // const { placeholderArray } = params.query
    // if (Array.isArray(placeholderArray)) {
    //   const patchData = await super.patch(id, data, params)
    //   return patchData
    // }
    return super.patch(id, data, params)
  }
  async remove(id: Id, params?: ServiceParams): Promise<Datasets>
  async remove(id: null, params?: ServiceParams): Promise<Datasets[]>
  async remove(id: Id, params?: ServiceParams): Promise<Datasets | Datasets[]> {
    console.log('remove')
    const removeResponse = await super.remove(id, params)

    const { placeholderArray } = params.query
    if (Array.isArray(placeholderArray)) {
      return [
        {
          id: 1,
          projectId: 'removed',
          dataset: { data: 'removed' },
          ...removeResponse,
        },
      ]
    }

    return {
      id: 1,
      projectId: 'removed',
      dataset: { data: 'removed' },
      ...removeResponse,
    }
  }
}
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'datasets',
  }
}
