// DOCUMENTED 
// Import required libraries with dynamic import as awaited import
// This prevents stalling the Featherjs app creation
import import_ from '@brillout/import';
import * as crypto from "crypto";
import fs from 'fs';
import {
  HierarchicalNSW,
  SpaceName
} from "hnswlib-node";
import { Embeddings } from "langchain/dist/embeddings/base";
import path from "node:path";

const InMemoryDocstorePro = import_("langchain/docstore");
const { InMemoryDocstore } = await InMemoryDocstorePro;
const DocumentPro = import_("langchain/document");
const { Document } = await DocumentPro;
const SaveableVectorStorePro = import_("langchain/vectorstores");
const { SaveableVectorStore } = await SaveableVectorStorePro;
const SupabaseVectorStorePro = import_("langchain/vectorstores");
const { SupabaseVectorStore } = await SupabaseVectorStorePro;

/**
 * Custom implementation of SupabaseVectorStore
 * @extends {SupabaseVectorStore}
 */
export class SupabaseVectorStoreCustom extends SupabaseVectorStore {
  client: any;
  tableName: string;
  queryName: string;
  
  constructor(embeddings: Embeddings, args: Record<string, any>) {
    super(embeddings, args);

    this.client = args.client;
    this.tableName = args.tableName || "documents";
    this.queryName = args.queryName || "match_documents";
  }

  /**
   * Add documents with optional precomputed vector 
   * @param {Document[]} documents - Array of documents
   * @param {any[]} [vector=''] - Precomputed vector (optional)
   * @returns {Promise<void>}
   */
  async addDocuments(documents: Document[], vector: any = ''): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    if (vector != '') {
      return this.addVectors(vector, documents);
    }
    return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
  }

  /**
   * Add vectors along with documents
   * @param {number[][]} vectors - Array of vectors
   * @param {Document[]} documents - Array of documents
   * @returns {Promise<void>}
   */
  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
    const res = await this.client.from(this.tableName).insert(documents);
    if (res.error) {
      throw new Error(`Error inserting: ${res.error.message} ${res.status} ${res.statusText}`);
    }
  }

  /**
   * Add events to the tableName in the Supabase client
   * @param {any[]} events - Array of events
   * @returns {Promise<void>}
   */
  async addEvents(events: any[]): Promise<void> {
    events.array.forEach(async element => {
      const res = await this.client.from(this.tableName).insert(element);
      if (res.error) {
          throw new Error(`Error inserting: ${res.error.message} ${res.status} ${res.statusText}`);
      }
    });
  }

  /**
   * Perform rpc on the Supabase client
   * @param {string} query - Query to be executed
   * @param {Record<string, unknown>} params - Query parameters
   * @returns {Promise<any>}
   */
  rpc(query: string, params: Record<string, unknown>): Promise<any> {
    return this.client.rpc(query, params);
  }

  /**
   * Select a table in the Supabase client
   * @param {string} table - Table name
   * @returns {any}
   */
  from(table: string): any {
    return this.client.from(table);
  }

  /**
   * Get documents by their IDs
   * @param {string[]} ids - Array of document IDs
   * @returns {Promise<Document[]>}
   */
  async getDocuments(ids: string[]): Promise<Document[]> {
    const res = await this.client.from(this.tableName).select("*").in("id", ids);
    if (res.error) {
        throw new Error(`Error getting documents: ${res.error.message} ${res.status} ${res.statusText}`);
    }
    return res.data;
  }
}

// Add type for Document
export type Document = {
  id(id: any): number;
  metadata: any,
  pageContent: any
}

// Add interfaces for HNSWLib constructor arguments
export interface HNSWLibBase {
  filename: string;
  space: SpaceName;
  numDimensions?: number;
}

export interface HNSWLibArgs extends HNSWLibBase {
  docstore?: typeof InMemoryDocstore;
  index?: HierarchicalNSW;
}

// Add interface for EmbeddingWithData
export interface EmbeddingWithData {
  embedding: number[] | null;
  data: Record<string, unknown>;
}

/**
 * HNSWLib class to perform nearest neighbor search on a
 * vector store/index based on the HierarchicalNSW algorithm
 * @extends {SaveableVectorStore}
 */
export class HNSWLib extends SaveableVectorStore {
  _index?: HierarchicalNSW;

  docstore: typeof InMemoryDocstore;

  args: HNSWLibBase;

  declare embeddings: Embeddings;

  /**
   * Constructs an instance of HNSWLib
   * @param {Embeddings} embeddings - Embeddings object
   * @param {HNSWLibArgs} args - Constructor arguments
   */
  constructor(embeddings: Embeddings, args: HNSWLibArgs) {
    super(embeddings, args);
    this._index = args.index;
    this.args = args;
    this.embeddings = embeddings;
    this.docstore = args?.docstore ?? new InMemoryDocstore();
  }

  /**
   * Add array of documents
   * @param {Document[]} documents - Array of documents
   * @returns {Promise<void>}
   */
  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    );
  }

  // Add other helper methods for HNSWLib here
  async add(id: any, embedding: any, a: any = "sss") { }

  async search(a: any, b: any) { }

  async searchData(a: any, b: any) { }

  /**
   * Delete a document by its ID
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const docId = Array.from(this.docstore._docs.keys()).find(key => {
      const metadata = this.docstore._docs.get(key)?.metadata;
      if (metadata && key == HNSWLib.sha256ToDecimal(id)) {
        try {
          this.index.markDelete(HNSWLib.sha256ToDecimal(id));
          this.docstore._docs.delete(key)
        } catch {
          console.error("NOT FOUND IN INDEX. Possible Index Mismatch Delete the Database.")
        }
      }
    });
    this.save(this.args.filename)
    return docId as any || [];
  }

  /**
   * Extract metadata from results after performing a similarity search with query vector
   * @param {number[]} query - Query vector
   * @param {number} k - Number of results to return
   * @param {Record<string, unknown>} [query_data={}] - Optional query data for filtering results
   * @returns {Promise<Record<string, any>>}
   */
  async extractMetadataFromResults(
    query: number[],
    k: number,
    query_data: Record<string, unknown> = {}
  ): Promise<Record<string, any>> {
    const results = await this.similaritySearchVectorWithScore(query, k, query_data);
    return results.map(([doc, _]) => doc.metadata);
  }

  /**
   * Add embedding and metadata
   * @param {number[]} embedding - Embedding vector
   * @param {Document} metadata - Document metadata
   * @returns {Promise<void>}
   */
  async addEmbeddingWithMetadata(
    embedding: number[],
    metadata: Document
  ): Promise<void> {
    if (embedding.length !== this.args.numDimensions) {
      throw new Error(
        `Embedding must have the same length as the number of dimensions (${this.args.numDimensions})`
      );
    }
    const docstoreSize = this.docstore.count;
    this.index.addPoint(embedding, HNSWLib.sha256ToDecimal(metadata.id));
    this.docstore.add({ [HNSWLib.sha256ToDecimal(metadata.id)]: metadata });
    await this.save(this.args.filename)
    await this.saveIndex(this.args.filename);
  }

  /**
   * Add array of embeddings with their data
   * @param {EmbeddingWithData[]} embeddings - Array of EmbeddingWithData objects
   * @returns {Promise<void>}
   */
  async addEmbeddingsWithData(embeddings: EmbeddingWithData[]): Promise<void> {
    const vectors: number[][] = [];
    const documents: Document[] = [];
    for (const { embedding, data } of embeddings) {
