// DOCUMENTED 
// This module provides a document service for managing documents with embedding and pagination support
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers';
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex';
import { KnexService } from '@feathersjs/knex';
import { DATABASE_TYPE } from '@magickml/core'

import { app } from '../../app';
import type { Application } from '../../declarations';
import type {
  DocumentData,
  DocumentPatch,
  DocumentQuery
} from './documents.schema';

// Extended parameter type for DocumentService support
export type DocumentParams = KnexAdapterParams<DocumentQuery>;

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
    if (DATABASE_TYPE == 'pg'){
      const docdb = app.get('docdb')
      await docdb.fromString(data.content, data);
    }
    return data
  }

  /**
   * Removes a document by ID
   * @param id {string} The document ID to remove
   * @return {Promise<any>} The removed document
   */
  async remove(id: string): Promise<any> {
    if (DATABASE_TYPE == 'sqlite'){
      const docdb = app.get('docdb')
      const r = docdb.delete(id)
      return r
    } else{
      const db = app.get('dbClient');
      return await db('documents').where('id', id).del();
    }
  }

  /**
   * Finds documents with optional filters
   * @param params {ServiceParams} Optional parameters for the find operation
   * @return {Promise<any>} The found documents
   */
  async find(params?: ServiceParams): Promise<any> {
    const db = app.get('dbClient')
    const cli = app.get('docdb')
    if (DATABASE_TYPE == 'sqlite'){
      const docdb = app.get('docdb')
      if (params.query.embedding) {
        const blob = atob(params.query.embedding)
        const ary_buf = new ArrayBuffer(blob.length)
        const dv = new DataView(ary_buf)
        for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
        const f32_ary = new Float32Array(ary_buf)
        const query = f32_ary as unknown as number[]
        const { $limit: _, ...param } = params.query
        const search_result = await docdb.extractMetadataFromResults(query, 2, param)
        if (search_result) {
          return { data: search_result }
        }
      }
      const { $limit: _, ...param } = params.query
      const tr = await docdb.getDataWithMetadata(param, 10);
      return { data: tr }
    } else {
       if (params.query.embedding) {
          const blob = atob(params.query.embedding)
          const ary_buf = new ArrayBuffer(blob.length)
          const dv = new DataView(ary_buf)
          for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
          const f32_ary = new Float32Array(ary_buf)
          const query = f32_ary as unknown as number[]
          const { $limit: _, ...param } = params.query
          const querys = await db('events').select('*')
          .where(
            {
              ...(param.type && {'type': param.type}),
              ...(param.id && {'id': param.id}),
              ...(param.sender && {'sender': param.sender}),
              ...(param.client && {'client': param.client}),
              ...(param.channel && {'channel': param.channel}),
              ...(param.projectId && {'projectId': param.projectId}),
              ...(param.content && {'content': param.content})
          })
          .orderByRaw(`embedding <-> ${"'[" + f32_ary.toString() + "]'"}`)
          const result = await db.raw(`select * from events order by embedding <-> ${"'[" + f32_ary.toString() + "]'"} limit 1;`)
          const bod = {query_embedding: "[" + f32_ary.toString() + "]", match_count: 2, content_to_match: "hi"}
          const rr = await cli.rpc("match_events",bod)
          console.log(rr)
          return {data: querys}
       }
       const res = await super.find(params);
       return {data: (res as unknown as {data: Array<any>}).data};
    }
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
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'documents',
  };
};