// DOCUMENTED 
// This module provides a document service for managing documents with embedding and pagination support
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';

import type { Application } from '../../declarations';
import type {
  DocumentData,
  DocumentPatch,
  DocumentQuery,
} from './documents.schema';
import { app } from '../../app';

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
   * Custom find() method adds support for embeddings in the query
   * @async
   * @param {ServiceParams} [params] - The query parameters
   * @return {Promise<Array<DocumentData> | Paginated<DocumentData>>} - The found documents
   */
  async find(params?: ServiceParams) {
    const db = app.get('dbClient');
    
    if (params.query.embedding) {
      const blob = atob(params.query.embedding);
      const ary_buf = new ArrayBuffer(blob.length);
      const dv = new DataView(ary_buf);
      
      for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i));
      
      const f32_ary = new Float32Array(ary_buf);
      const vectordb = app.get('vectordb');
      const query = f32_ary as unknown as number[];
      const k = 2;
      
      const results = vectordb.search(query, k);
      const result_s = await db('documents').where('id', results[0]).first();
      
      console.log(result_s);
      
      if (result_s) {
        return result_s;
      }
    }
    
    return super.find(params);
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