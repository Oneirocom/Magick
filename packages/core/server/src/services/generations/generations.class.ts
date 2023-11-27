import type { Id, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { GenerationSchema } from '@magickml/core'
import type {
  GenerationData,
  GenerationPatch,
  GenerationQuery,
} from './generations.schema'
import AWS from 'aws-sdk'
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
  AWS_BUCKET_ENDPOINT,
} from '@magickml/config'
import { v4 } from 'uuid'

// Define GenerationParams type based on KnexAdapterParams with GenerationQuery
export type GenerationParams = KnexAdapterParams<GenerationQuery>

/**
 * Default GenerationService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class GenerationService<
  ServiceParams extends Params = GenerationParams
> extends KnexService<
  GenerationSchema,
  GenerationData,
  ServiceParams,
  GenerationPatch
> {
  app: Application
  s3: AWS.S3
  bucketName: string = AWS_BUCKET_NAME

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app

    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION,
    })
    this.s3 = new AWS.S3({
      endpoint: AWS_BUCKET_ENDPOINT,
      s3ForcePathStyle: true,
    })
  }

  async create(
    data,
    params?: ServiceParams
  ): Promise<GenerationSchema | GenerationSchema[] | any> {
    if (data.files && Array.isArray(data.files) && data.files.length > 0) {
      const uploadPromises = data.files.map((fileBase64, index) => {
        const buffer = Buffer.from(fileBase64, 'base64')
        const params = {
          Bucket: this.bucketName,
          Key: `generations/${data.projectId}/${data.id}/${index + 1}.png`,
          Body: buffer,
          ACL: 'public-read',
        }

        return this.s3.upload(params).promise()
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      data.paths = uploadedFiles.map(file => file.key)
      console.log('uploadedFiles', uploadedFiles)
      console.log('dataPaths', data.paths)
      delete data.files
    }

    return await super.create(data, params)
  }

  async find(params?: ServiceParams): Promise<any> {
    if (params?.query?.ids) {
      params.query.id = { $in: params.query.ids }
      delete params.query.ids
    }

    return await super.find(params)
  }

  async patch(
    id: Id | null,
    data: GenerationPatch,
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
 * Returns options needed to initialize the GenerationService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'generations',
    multi: ['remove'],
  }
}
