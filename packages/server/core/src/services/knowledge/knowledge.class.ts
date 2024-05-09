// FILEED
// This module provides a knowledge service for managing knowledge with embedding and pagination support
// For more information about this knowledge see https://dove.feathersjs.com/guides/cli/service.class.html#database-services

import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexAdapter } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type {
  KnowledgeData,
  KnowledgePatch,
  KnowledgeQuery,
} from './knowledge.schema'
import { CoreMemoryService } from 'plugin/core'
import { DataType, getDataTypeFromAcceptValue } from 'servicesShared'
import { CreateKnowledgeMutation, isValidAcceptValue } from 'servicesShared'
import { Storage } from '@google-cloud/storage'

// Extended parameter type for KnowledgeService support
export type KnowledgeParams = KnexAdapterParams<KnowledgeQuery>

/**
 * KnowledgeService class
 * Implements the custom knowledge service extending the base Knex service
 * @extends {KnexService}
 * @template ServiceParams {Params} Parameter type extended from base Params
 */
export class KnowledgeService<
  ServiceParams extends Params = KnowledgeParams
> extends KnexAdapter<
  KnowledgeQuery,
  KnowledgeData,
  ServiceParams,
  KnowledgePatch
> {
  storage: Storage
  constructor(args) {
    super(args)
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    })
  }

  /**
   * Creates a new knowledge
   * @param data {KnowledgeData} The knowledge data to create
   * @return {Promise<any>} The created knowledge
   */
  async create({ projectId, knowledge }: CreateKnowledgeMutation) {
    if (!projectId) {
      throw new Error('Project id is required')
    }

    const returnData = [] as KnowledgeData[]

    for (const data of knowledge) {
      console.log('Creating knowledge:', data)
      let dataType: DataType | undefined
      if (!data.external) {
        if (!isValidAcceptValue(data.dataType)) {
          throw new Error('Invalid data type')
        }
        dataType = getDataTypeFromAcceptValue(data.dataType) as DataType
      } else {
        dataType = data.dataType as DataType
      }

      const memoryService = new CoreMemoryService(true)
      await memoryService.initialize(projectId)

      const url = data.external
        ? data.sourceUrl
        : await this.storage
            .bucket(process.env.GOOGLE_PRIVATE_BUCKET_NAME)
            .file(data.sourceUrl)
            .getSignedUrl({
              version: 'v4',
              action: 'read',
              expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            })
            .then(urls => urls[0])

      const type = data.external
        ? data.dataType
          ? data.dataType
          : undefined
        : undefined

      const options = {
        metadata: {
          tag: data?.tag || 'none',
        },
        dataType: type as DataType,
      }

      // Add the data to the memory
      const result = await memoryService.add(url, options)

      const knowledgeData = {
        dataType: data.external ? data.dataType : undefined, // TODO: fix the dataType for uploads. its very close to being correct. for now auto-detect
        sourceUrl: process.env.PROJECT_BUCKET_PREFIX + result,
        metadata: options.metadata,
        projectId: projectId,
        memoryId: result,
        name: data.name,
      }

      await this._create(knowledgeData)
      returnData.push(knowledgeData)
    }

    return returnData
  }

  async get(knowledgeId: string, params: ServiceParams) {
    this._get(knowledgeId, params)
  }

  async patch(spellId: string, params: KnowledgePatch) {
    return this._patch(spellId, params)
  }

  async remove(knowledgeId: string, params: ServiceParams) {
    if (!knowledgeId) {
      throw new Error('Knowledge id is required')
    }

    const knowledge = (await this._get(knowledgeId, params)) as KnowledgeData

    if (!knowledge) {
      throw new Error('Knowledge not found')
    }

    const memoryService = new CoreMemoryService(true)
    await memoryService.initialize(knowledge.projectId as string)

    try {
      await memoryService.remove(knowledge.memoryId)
    } catch (error) {
      console.error('Error removing from Embedchain:', error)
      throw error
    }

    return this._remove(knowledgeId, params)
  }
  /**
   * Finds knowledge with optional filters
   * @param params {ServiceParams} Optional parameters for the find operation
   * @return {Promise<any>} The found knowledge
   */
  async find(params: ServiceParams): Promise<any> {
    if (!params?.query?.projectId) {
      throw new Error('Project id is required')
    }

    return this._find(params)
  }
}

/**
 * getOptions function
 * Returns the options for the KnowledgeService
 * @export
 * @param {Application} app - The application instance
 * @return {KnexAdapterOptions} - The options for the KnowledgeService
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'knowledge',
    multi: ['remove'],
  }
}
