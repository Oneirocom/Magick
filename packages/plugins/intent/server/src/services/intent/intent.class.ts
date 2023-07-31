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
import {
  CompletionProvider,
  MagickWorkerOutputs,
  WorkerData,
  pluginManager,
} from '@magickml/core'

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
      const { secrets, modelName, chatModelName, variations, ...docData } =
        data as IntentData & {
          secrets: string
          modelName: string
          chatModelName: string
          variations: number
        }

      //call chat model and get n variations
      // get completion providers for text and chat categories
      const completionProviders = pluginManager.getCompletionProviders('text', [
        'text',
        'chat',
      ]) as CompletionProvider[]
      const provider = completionProviders.find(provider =>
        provider.models.includes(chatModelName)
      ) as CompletionProvider
      const completionHandler = provider.handler

      if (!completionHandler) {
        console.error('No completion handler found for provider', provider)
        throw new Error('ERROR: Completion handler undefined')
      }

      //mocking up a whole node >_>
      let node: WorkerData = {
        id: 7002,
        name: 'spell',
        inputs: {
          input: {
            connections: [
              { output: 'output', node: 7004, data: { hello: 'hello' } },
            ],
          },
          system: {
            connections: [
              { output: 'output', node: 7003, data: { hello: 'hello' } },
            ],
          },
          trigger: {
            connections: [
              { output: 'trigger', node: 232, data: { hello: 'hello' } },
            ],
          },
        },
        outputs: {
          trigger: {
            connections: [
              { input: 'trigger', node: 233, data: { hello: 'hello' } },
            ],
          },
          result: {
            connections: [
              { input: 'input', node: 232, data: { hello: 'hello' } },
            ],
          },
        },
        data: {
          frequency_penalty: 0,
          model: chatModelName,
          presence_penalty: 0,
          stopSequences: '',
          temperature: 0.5,
          top_k: 50,
          top_p: 1,
        },
        position: [272, 0],
      }

      let inputs = { input: ['inputvalue'], system: ['prompt'] }
      let outputs: MagickWorkerOutputs = {
        // result: {
        //   type: 'output',
        //   key: 'result',
        //   task: null
        // },
        // trigger: {
        //   type: 'option',
        //   key: 'trigger',
        // },
      }
      let context = {
        module: {
          secrets: JSON.parse(secrets),
        },
        projectId: '',
        currentSpell: '',
      }

      const { success, result, error } = await completionHandler({
        node,
        inputs,
        outputs,
        context,
      })
      console.log('result', result)
      if (!success) {
        throw new Error('ERROR: ' + error)
      }

      //split and remove numbers, for each:

      //create new document/embedding

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
