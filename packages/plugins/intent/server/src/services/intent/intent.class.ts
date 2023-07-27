// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Params, ServiceInterface } from '@feathersjs/feathers'
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
   * Handles the CREATE operation for the IntentService.
   * @param data - The data to create the new Intent resource.
   * @param params - Optional service parameters.
   * @returns a Promise resolving to the created Intent resources or error message.
   */
  async create(data: IntentData, params?: ServiceParams): Promise<Intent>
  async create(data: IntentData[], params?: ServiceParams): Promise<Intent[]>
  async create(data: IntentData | IntentData[]): Promise<Intent | any> {
    //use text generation completion provider to create n variants

    //for each variant:
    //create a text embedding and save to documents
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

/** Helper function to get options for the IntentService. */
export const getOptions = (app: Application) => {
  return { app }
}
