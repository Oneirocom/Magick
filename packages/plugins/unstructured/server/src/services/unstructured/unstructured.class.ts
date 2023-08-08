// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { Application, app } from '@magickml/server-core'
import type {
  Unstructured,
  UnstructuredData,
  UnstructuredPatch,
  UnstructuredQuery,
} from './unstructured.schema'
import {
  CompletionProvider,
  MagickWorkerOutputs,
  WorkerData,
  pluginManager,
} from '@magickml/core'
import axios from 'axios'

/** Type for Unstructured Params */
export type UnstructuredParams = KnexAdapterParams<UnstructuredQuery>

/**
 * DocumentService class
 * Implements the custom document service extending the base Knex service
 * @extends {KnexService}
 * @template ServiceParams {Params} Parameter type extended from base Params
 */
export class UnstructuredService<
  ServiceParams extends Params = UnstructuredParams
> extends KnexService<
  Unstructured,
  UnstructuredData,
  ServiceParams,
  UnstructuredPatch
> {
  /**
   * Creates a new Unstructured
   * @param data {DocumentData} The document data to create
   * @return {Promise<any>} The created document
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async create(data: UnstructuredData): Promise<any> {
    data

    const headers = {
      accept: 'application/json',
      'unstructured-api-key': 'gOjoJNgNz2kBUrntiWOxazgHYlI3nI',
    }

    const form = new FormData()
    form.append('strategy', 'auto')

    const completion = await axios.postForm(
      `https://api.unstructured.io/general/v0.0.34/general`,
      form,
      { headers: headers }
    )

    if (completion.data.error) {
      console.error('Unstructured.io Error', completion.data.error)
    }
    return 'test'
  }
}

/**
 * getOptions function
 * Returns the options for the DocumentService
 * @export
 * @param {Application} app - The application instance
 * @return {KnexAdapterOptions} - The options for the DocumentService
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'documents',
    multi: ['remove'],
  }
}
