// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { Application, app } from 'server/core'
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
} from 'shared/core'
import { v4 as uuidv4 } from 'uuid'

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
    const embeddingdb = app.get('embeddingdb')

    if (data.hasOwnProperty('secrets')) {
      const { variations, secrets, modelName, chatModelName, ...docData } =
        data as IntentData & {
          secrets: string
          modelName: string
          chatModelName: string
          variations: number
        }

      const documentId = uuidv4()
      const document = {
        date: docData.date,
        type: docData.type,
        projectId: docData.projectId,
        id: documentId,
        metadata: data.metadata,
      }
      const embedding = {
        documentId,
        index: 0,
        content: docData.content,
      }

      await embeddingdb.from('documents').insert(document)
      await embeddingdb.fromString(embedding.content, embedding, {
        modelName,
        projectId: document.projectId,
        secrets,
      })

      if (variations > 0) {
        //call chat model and get n variations
        // get completion providers for text and chat categories
        const completionProviders = pluginManager.getCompletionProviders(
          'text',
          ['text', 'chat']
        ) as CompletionProvider[]
        const provider = completionProviders.find(provider =>
          provider.models.includes(chatModelName)
        ) as CompletionProvider
        const completionHandler = provider.handler

        if (!completionHandler) {
          console.error('No completion handler found for provider', provider)
          throw new Error('ERROR: Completion handler undefined')
        }

        //mocking up a whole node >_>
        const node: WorkerData = {
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

        const inputs = {
          input: [docData.content],
          system: [
            `You are a chat bot that takes an input sentence and responds with ${variations} variations that mean the same thing.`,
          ],
        }
        const outputs: MagickWorkerOutputs = {}
        const context = {
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
        const results: string[] = String(result)
          .split('\n')
          .map(val => val.substring(3))

        //create new document/embedding
        for (const result of results) {
          const documentId = uuidv4()
          const document = {
            date: docData.date,
            type: docData.type,
            projectId: docData.projectId,
            id: documentId,
            metadata: data.metadata,
          }
          const embedding = {
            documentId,
            index: 0,
            content: result,
          }

          await embeddingdb.from('documents').insert(document)
          await embeddingdb.fromString(result, embedding, {
            modelName,
            projectId: docData.projectId,
            secrets,
          })
        }
      }

      return docData
    }

    const documentId = uuidv4()
    const document = {
      date: data.date,
      type: data.type,
      projectId: data.projectId,
      id: documentId,
      metadata: data.metadata,
    }
    const embedding = {
      documentId,
      index: 0,
      content: data.content,
      embedding: data.embedding,
    }

    await embeddingdb.from('documents').insert(document)
    await embeddingdb.from('embeddings').insert(embedding)
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
