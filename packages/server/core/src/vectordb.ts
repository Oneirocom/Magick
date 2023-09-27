// DOCUMENTED
/* 

This code is adapted from the langchainjs library under the MIT license.
The original library can be found at https://github.com/hwchase17/langchainjs.

*/

import { Document } from 'langchain/document'
import { Embeddings } from 'langchain/embeddings/base'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { expandVector } from 'shared/core'
import { v4 as uuidv4 } from 'uuid'
import { EmbeddingArgs } from './customEmbeddings'

export type ExtendedEmbeddings = Embeddings & {
  embedQueryWithMeta: (query: string, args: EmbeddingArgs) => Promise<any>
  embedDocumentsWithMeta: (
    documents: string,
    args: EmbeddingArgs
  ) => Promise<any>
}
/**
 * Custom implementation of SupabaseVectorStore
 * @extends {PostgresVectorStore}
 */
export class PostgresVectorStoreCustom extends SupabaseVectorStore {
  constructor(embeddings: ExtendedEmbeddings, args: Record<string, any>) {
    super(embeddings, args as any)

    this.client = args.client
    this.tableName = args.tableName || 'embeddings'
    this.queryName = args.queryName || 'match_embeddings'
  }

  /**
   * Add documents with optional precomputed vector
   * @param {Document[]} documents - Array of documents
   * @param {any[]} [vector=''] - Precomputed vector (optional)
   * @returns {Promise<void>}
   */
  async addDocuments(documents: Document[], vector: any = ''): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent)
    if (vector != '') {
      return this.addVectors(vector, documents)
    }
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    )
  }

  /**
   * Add vectors along with documents
   * @param {number[][]} vectors - Array of vectors
   * @param {Document[]} documents - Array of documents
   * @returns {Promise<void>}
   */
  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
    const res = await this.client(this.tableName).insert(documents)
    if (res.error) {
      throw new Error(
        `Error inserting: ${res.error.message} ${res.status} ${res.statusText}`
      )
    }
  }

  /**
   * Creates Documents using String and Metadata
   * @param {string} text - String to be embedded
   * @param {any[]} metadata - Metadata to be added to the document
   * @returns {Promise<any>} - Array of documents
   * @async
   */
  async fromString(
    text: string,
    metadata: any[],
    args: EmbeddingArgs
  ): Promise<any> {
    let vector = await (
      this.embeddings as ExtendedEmbeddings
    ).embedQueryWithMeta(text, args)
    if (vector.length !== 1536) {
      vector = expandVector(vector as number[], 1536)
    }
    const insert_data = [
      {
        embedding: vector,
        data: {
          metadata: { ...metadata, embedding: vector } || { msg: 'Empty Data' },
          pageContent: text || 'No Content in the Event',
        },
      },
    ]
    await this.insertData({
      array: [{ ...metadata, embedding: JSON.stringify(vector) }],
    })
    return insert_data
  }

  /**
   * Add events to the tableName in the Postgres database
   * @param { array: any[]} events - Array of events
   * @returns {Promise<void>}
   */
  async insertData(documents: { array: any[] }): Promise<void> {
    documents.array.forEach(async element => {
      const res = await this.client(this.tableName).insert(element)
      if (res.error) {
        throw new Error(
          `Error inserting: ${res.error.message} ${res.status} ${res.statusText}`
        )
      }
    })
  }

  /**
   * Perform postgres function call
   * @param {string} query - Query to be executed or the function name
   * @param {Record<string, unknown>} params - Query parameters
   * @returns {Promise<any>}
   */
  async rpc(query: string, params: Record<string, unknown>): Promise<any> {
    const columns = Object.keys(params)
    const placeholders = columns.map(name =>
      params[name] ? `:${name}` : 'NULL'
    )
    const sql = `SELECT * FROM ${query}(${placeholders.join(', ')})`
    return this.client.raw(sql, params)
  }

  /**
   * Select a table in the Postgres client
   * @param {string} table - Table name
   * @returns {any}
   */
  from(table: string): any {
    return this.client(table)
  }

  /**
   * Get documents by their IDs
   * @param {string[]} ids - Array of document IDs
   * @returns {Promise<Document[]>}
   */
  async getDocuments(ids: string[]): Promise<Document[]> {
    const res = await this.client.from(this.tableName).select('*').in('id', ids)
    if (res.error) {
      throw new Error(
        `Error getting documents: ${res.error.message} ${res.status} ${res.statusText}`
      )
    }
    return res.data
  }
}
