// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { Application, app } from '@magickml/server-core'
import type {
  Intent,
  IntentData,
  IntentPatch,
  IntentQuery,
} from './intent.schema'

/** Type for Intent Params */
export type IntentParams = KnexAdapterParams<IntentQuery>

/**
 * DocumentService class
 * Implements the custom document service extending the base Knex service
 * @extends {KnexService}
 * @template ServiceParams {Params} Parameter type extended from base Params
 */
export class IntentService<
  ServiceParams extends Params = IntentParams
> extends KnexService<Intent, IntentData, ServiceParams, IntentPatch> {
  /**
   * Creates a new Intent
   * @param data {DocumentData} The document data to create
   * @return {Promise<any>} The created document
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async create(data: IntentData): Promise<any> {
    const docdb = app.get('docdb')
    if (data.hasOwnProperty('secrets')) {
      const { secrets, modelName, ...docData } = data as IntentData & {
        secrets: string
        modelName: string
      }

      docdb.fromString(docData.content, docData, {
        modelName,
        projectId: docData?.projectId,
        secrets,
      })

      return docData
    }
    await docdb.from('documents').insert(data)
    return data
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
