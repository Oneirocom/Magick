// FILEED
// This module provides a knowledge service for managing knowledge with embedding and pagination support
// For more information about this knowledge see https://dove.feathersjs.com/guides/cli/service.class.html#database-services

import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexAdapter } from '@feathersjs/knex'
import fs from 'fs'

import type { Application } from '../../declarations'
import type {
  KnowledgeData,
  KnowledgePatch,
  KnowledgeQuery,
} from './knowledge.schema'
import { CoreMemoryService } from 'plugin/core'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  AWS_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_KEY,
} from 'shared/config'
import { DataType } from 'servicesShared'

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
  s3: S3Client
  bucketName: string = AWS_BUCKET_NAME

  constructor(args) {
    super(args)
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
      region: AWS_REGION,
    })
  }

  async handleFiles(
    data: KnowledgeData,
    options: any,
    memoryService: CoreMemoryService
  ) {
    const results = [] as any[]

    for (const file of data.files) {
      const filePath = file.filepath // Path where the knowledge is temporarily stored
      const fileStream = fs.createReadStream(filePath) // Create a readable stream

      const key = `projects/${data.projectId}/knowledge/${file.originalFilename}` // The name you want the uploaded knowledge to have in S3
      const s3Params = {
        Bucket: this.bucketName,
        Key: key,
        Body: fileStream, // Use the stream here
        ContentType: file.mimetype || 'application/octet-stream', // Use the correct MIME type
      }

      const command = new PutObjectCommand(s3Params)

      try {
        await this.s3.send(command)

        const sourceUrl = `https://${this.bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}` // Construct the S3 URL
        const metaData = {
          ...options.metadata,
          fileName: file.originalFilename,
          sourceUrl,
          s3Key: key,
        }

        // If you need to add the S3 knowledge reference or other info to embedchain
        const memoryResult = await memoryService.add(sourceUrl, {
          metadata: metaData,
        })

        console.log('Embedchain result:', memoryResult)

        const knowledgeData = {
          dataType: data.dataType || file.mimetype,
          sourceUrl,
          metadata: metaData,
          projectId: data.projectId,
          memoryId: memoryResult,
          name: file.originalFilename,
        }

        const result = await this._create(knowledgeData)
        results.push(result)
      } catch (error) {
        console.error('Error uploading to S3:', error)
        throw error // Rethrow the error or handle it as per your error handling policy
      }
    }

    return results
  }

  /**
   * Creates a new knowledge
   * @param data {KnowledgeData} The knowledge data to create
   * @return {Promise<any>} The created knowledge
   */
  async create(data: KnowledgeData): Promise<any> {
    if (!data.projectId) {
      throw new Error('Project id is required')
    }

    if (data.dataType) {
      // validate datatype against DataType enum
      const dataType = DataType[data.dataType as keyof typeof DataType]

      if (!dataType) {
        throw new Error('Invalid data type.')
      }
    }

    if (data.files && data.sourceUrl) {
      throw new Error('Cannot have both files and sourceUrl')
    }

    const options = {
      metadata: {
        ...data?.metadata,
        tag: data?.tag || 'none',
      },
      ...(data?.dataType && { dataType: data?.dataType as DataType }),
    }

    const memoryService = new CoreMemoryService(true)
    await memoryService.initialize(data.projectId as string)

    if (data.files && data.files.length > 0) {
      return this.handleFiles(data, options, memoryService)
    }

    // if we are here, we are handling other data types.
    const result = await memoryService.add(data.sourceUrl as string, options)

    const knowledgeData = {
      dataType: data.dataType,
      sourceUrl: data.sourceUrl,
      metadata: options.metadata,
      projectId: data.projectId,
      memoryId: result,
      name: data.name,
    }

    return this._create(knowledgeData)
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
