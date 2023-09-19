// DOCUMENTED
// This module provides a document service for managing documents with embedding and pagination support
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services

import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { FormData, File } from 'formdata-node'

import { app } from '../../app'
import type { Application } from '../../declarations'
import type {
  DocumentData,
  DocumentPatch,
  DocumentQuery,
} from './documents.schema'
import fs from 'fs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Extended parameter type for DocumentService support
export type DocumentParams = KnexAdapterParams<DocumentQuery>

/**
 * DocumentService class
 * Implements the custom document service extending the base Knex service
 * @extends {KnexService}
 * @template ServiceParams {Params} Parameter type extended from base Params
 */
export class DocumentService<
  ServiceParams extends Params = DocumentParams
> extends KnexService<Document, DocumentData, ServiceParams, DocumentPatch> {
  /**
   * Creates a new document
   * @param data {DocumentData} The document data to create
   * @return {Promise<any>} The created document
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async create(data: DocumentData): Promise<any> {
    const embeddingdb = app.get('embeddingdb')
    const { modelName, secrets, files, ...docData } = data as DocumentData & {
      modelName: string
      secrets: string
    }

    let elements = [] as any[]
    if (docData.content) {
      elements = [
        ...elements,
        ...(await getUnstructuredData(
          [{ text: docData.content, originalFilename: 'text.txt' }],
          docData
        )),
      ]
    }
    if (files && files.length > 0) {
      elements = [...elements, ...(await getUnstructuredData(files, docData))]
    }

    for (const element of elements) {
      let { embeddings, ...document } = element
      await embeddingdb.from('documents').insert(document)
      //create embeddings
      for (let embedding of element.embeddings) {
        if (!embedding.content) continue
        if (data.hasOwnProperty('secrets')) {
          await embeddingdb.fromString(embedding.content, embedding, {
            modelName,
            projectId: element.projectId,
            secrets,
          })
        } else {
          await embeddingdb.from('embeddings').insert(embedding)
        }
      }
    }

    return docData
  }

  /**
   * Removes a document by ID
   * @param id {string} The document ID to remove
   * @return {Promise<any>} The removed document
   */
  async remove(id: any, params): Promise<any> {
    const db = app.get('dbClient')

    if (!id && params.projectId) {
      await db('embeddings')
        .whereRaw(
          '"documentId" in (select id from documents where projectId = $)',
          params.projectId
        )
        .del()
      // delete all documents of a project
      return await db('documents').where('projectId', params.projectId).del()
    }

    await db('embeddings').where('documentId', id).del()
    return await db('documents').where('id', id).del()
  }

  /**
   * Finds documents with optional filters
   * @param params {ServiceParams} Optional parameters for the find operation
   * @return {Promise<any>} The found documents
   */
  async find(params?: ServiceParams): Promise<any> {
    const db = app.get('dbClient')
    if (
      (params && params?.query?.embedding) ||
      (params && params?.query?.metadata)
    ) {
      const param = params.query

      console.log('param!!!!!!!', param)

      const querys = await db('documents')
        .joinRaw(
          'inner join embeddings on documents.id = embeddings."documentId" and embeddings.index = 0'
        )
        // .innerJoin('embeddings', 'documents.id', '=', 'embeddings.documentId')
        .select('*')
        .where({
          ...(param.type && { type: param.type }),
          ...(param.id && { 'documents.id': param.id }),
          ...(param.projectId && { projectId: param.projectId }),
          ...(param.content && { content: param.content }),
        })
        .modify(function (queryBuilder) {
          param.embedding &&
            queryBuilder
              .select(
                db.raw(
                  `(embedding <=> '${JSON.stringify(
                    param.embedding
                  )}') AS distance`
                )
              )
              .orderBy('distance', 'asc')
        })
        .modify(function (queryBuilder) {
          if (param.metadata) {
            const metadata =
              typeof param.metadata == 'object'
                ? JSON.stringify(param.metadata)
                : param.metadata
            queryBuilder.whereRaw('metadata @> ?', [metadata])
          }
        })
        .limit(param.$limit)

      return { data: querys }
    }

    const param = params?.query

    if (!param) {
      return await db('documents')
        .joinRaw(
          'inner join embeddings on documents.id = embeddings."documentId" and embeddings.index = 0'
        )
        // .innerJoin('embeddings', 'documents.id', '=', 'embeddings.documentId')
        .select('*')
        .limit(100)
    }

    const querys = await db('documents')
      .joinRaw(
        'inner join embeddings on documents.id = embeddings."documentId" and embeddings.index = 0'
      )
      // .innerJoin('embeddings', 'documents.id', '=', 'embeddings.documentId')
      .select('*')
      .where({
        ...(param.type && { type: param.type }),
        ...(param.id && { 'documents.id': param.id }),
        ...(param.projectId && { projectId: param.projectId }),
        ...(param.content && { content: param.content }),
      })
      .modify(function (queryBuilder) {
        queryBuilder.whereRaw("metadata->'intent' IS NULL")
      })
      .limit(param.$limit)

    return { data: querys }
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

const getUnstructuredData = async (files, docData) => {
  const headers = {
    accept: 'application/json',
    'unstructured-api-key': process.env['UNSTRUCTURED_KEY'],
  }

  const form = new FormData()
  form.append('strategy', 'auto')
  for (const file of files as {
    filepath?: string
    originalFilename: string
    text?: string
  }[]) {
    // let mimeType = mime.lookup(file.originalFilename)
    // mimeType = mimeType ? mimeType : 'application/json'
    if (file.filepath) {
      const readFile = fs.readFileSync(file.filepath) //TODO: make this more performant
      form.append(
        'files',
        new File([readFile], file.originalFilename),
        file.originalFilename
      )
    } else if (file.text) {
      form.append(
        'files',
        new File([file.text], file.originalFilename),
        file.originalFilename
      )
    }
  }

  const unstructured = await axios.post(
    process.env['UNSTRUCTURED_ENDPOINT'] as string,
    form,
    {
      headers: headers,
    }
  )

  if (unstructured.data.error) {
    console.error('Unstructured.io Error', unstructured.data.error)
  }

  //iterate and format for document insert (api returns either an array or an array of arrays)
  const elements = [] as any[]
  if (unstructured.data[0] instanceof Array) {
    for (const i in unstructured.data) {
      elements.push(createElement(unstructured.data[i], docData))
    }
  } else {
    elements.push(createElement(unstructured.data, docData))
  }

  return elements
}

const createElement = (element, docData) => {
  let documentId = uuidv4()
  let embeddings: any[] = []
  for (let i in element) {
    embeddings.push({
      documentId,
      index: i,
      content: element[i].text,
    })
  }
  return {
    date: docData.date,
    type: docData.type,
    projectId: docData.projectId,
    id: documentId,
    metadata: {
      fileName: element[0].metadata.filename,
      fileType: element[0].metadata.filetype,
    },
    embeddings,
  }
}
