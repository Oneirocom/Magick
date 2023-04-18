// DOCUMENTED
/* eslint-disable @typescript-eslint/ban-types */
/* 

This code is adapted from the langchainjs library under the MIT license.
The original library can be found at https://github.com/hwchase17/langchainjs.

*/
import * as crypto from 'crypto'
import fs from 'fs'
import { HierarchicalNSW, SpaceName } from 'hnswlib-node'
import { Embeddings } from 'langchain/embeddings'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

import { InMemoryDocstore } from 'langchain/docstore'
import { Document } from 'langchain/document'
import {
  SaveableVectorStore,
  SupabaseVectorStore,
} from 'langchain/vectorstores'

/**
 * Custom implementation of SupabaseVectorStore
 * @extends {PostgressVectorStore}
 */
export class PostgressVectorStoreCustom extends SupabaseVectorStore {
  client: any
  tableName: string
  queryName: string

  constructor(embeddings: Embeddings, args: Record<string, any>) {
    super(embeddings, args as any)

    this.client = args.client
    this.tableName = args.tableName || 'documents'
    this.queryName = args.queryName || 'match_documents'
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
  async fromString(text: string, metadata: any[]): Promise<any> {
    if (text.length > 8000) {
      const [vectors, split_docs] = await this.embeddings.embedDocuments([text])
      vectors.forEach(async (vector, index) => {
        console.log(split_docs[index])
        console.log(index, vector)
        const insert_data = [
          {
            embedding: vector,
            data: {
              metadata: { ...metadata, embedding: vector } || {
                msg: 'Empty Data',
              },
              pageContent: split_docs[index] || 'No Content in the Event',
            },
          },
        ]
        metadata['id'] = uuidv4()
        metadata['content'] = split_docs[index]
        this.addEvents({
          array: [{ ...metadata, embedding: JSON.stringify(vector) }],
        })
      })
      return
    }
    const vector = await this.embeddings.embedQuery(text)
    console.log(vector)
    const insert_data = [
      {
        embedding: vector,
        data: {
          metadata: { ...metadata, embedding: vector } || { msg: 'Empty Data' },
          pageContent: text || 'No Content in the Event',
        },
      },
    ]
    this.addEvents({
      array: [{ ...metadata, embedding: JSON.stringify(vector) }],
    })
    return insert_data
  }

  /**
   * Add events to the tableName in the Postgres database
   * @param { array: any[]} events - Array of events
   * @returns {Promise<void>}
   */
  async addEvents(documents: { array: any[] }): Promise<void> {
    documents.array.forEach(async element => {
      console.log(element)
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
    console.log(sql)
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

// Add interfaces for HNSWLib constructor arguments
export interface HNSWLibBase {
  filename: string
  space: SpaceName
  numDimensions?: number
}

export interface HNSWLibArgs extends HNSWLibBase {
  docstore?: InMemoryDocstore
  index?: HierarchicalNSW
}

// Add interface for EmbeddingWithData
export interface EmbeddingWithData {
  embedding: number[] | null
  data: Record<string, unknown>
}

/**
 * HNSWLib class to perform nearest neighbor search on a
 * vector store/index based on the HierarchicalNSW algorithm
 * @extends {SaveableVectorStore}
 */
export class HNSWLib extends SaveableVectorStore {
  _index?: HierarchicalNSW

  docstore: InMemoryDocstore

  args: HNSWLibBase

  declare embeddings: any

  /**
   * Constructs an instance of HNSWLib
   * @param {Embeddings} embeddings - Embeddings object
   * @param {HNSWLibArgs} args - Constructor arguments
   */
  constructor(embeddings: Embeddings, args: HNSWLibArgs) {
    super(embeddings, args)
    this._index = args.index
    this.args = args
    this.embeddings = embeddings
    this.docstore = args?.docstore ?? new InMemoryDocstore()
  }

  /**
   * Add array of documents
   * @param {Document[]} documents - Array of documents
   * @returns {Promise<void>}
   */
  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent)
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    )
  }
  //Tech debt: add, search, searchData
  // Add other helper methods for HNSWLib here
  async add(id: any, embedding: any, a: any = 'sss') {
    /* null */
  }

  async search(a: any, b: any) {
    /* null */
  }

  async searchData(a: any, b: any) {
    /* null */
  }

  /**
   * Delete a document by its ID
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const docId = Array.from(this.docstore._docs.keys()).find(key => {
      const metadata = this.docstore._docs.get(key)?.metadata
      if (metadata && key === HNSWLib.sha256ToString(id)) {
        try {
          this.index.markDelete(HNSWLib.sha256ToDecimal(id))
          this.docstore._docs.delete(key)
        } catch {
          console.error(
            'NOT FOUND IN INDEX. Possible Index Mismatch Delete the Database.'
          )
        }
      }
    })
    this.save(this.args.filename)
    return (docId as any) || []
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
    const results = await this.similaritySearchVectorWithScore(
      query,
      k,
      query_data
    )
    return results.map(([doc, _]) => doc.metadata)
  }

  /**
   * Add embedding and metadata
   * @param {number[]} embedding - Embedding vector
   * @param {Document} metadata - Document metadata
   * @returns {Promise<void>}
   */
  async addEmbeddingWithMetadata(
    embedding: number[],
    document: Document
  ): Promise<void> {
    if (embedding.length !== this.args.numDimensions) {
      throw new Error(
        `Embedding must have the same length as the number of dimensions (${this.args.numDimensions})`
      )
    }
    this.index.addPoint(embedding, HNSWLib.sha256ToDecimal(document.metadata.id))
    this.docstore.add({ [HNSWLib.sha256ToString(document.metadata.id)]: document })
    await this.save(this.args.filename)
    await this.saveIndex(this.args.filename)
  }

  /**
   * Add embedding
   * @param {number[]} embedding - Embedding vector
   * @returns {Promise<void>}
   */
  async addEmbeddingsWithData(embeddings: EmbeddingWithData[]): Promise<void> {
    const vectors: number[][] = []
    const documents: Document[] = []
    for (const { embedding, data } of embeddings) {
      console.log(embedding)
      if (embedding) {
        if (embedding.length !== this.args.numDimensions) {
          throw new Error(
            `Embedding must have the same length as the number of dimensions (${this.args.numDimensions})`
          )
        }
        vectors.push(embedding)
      }
      documents.push(new Document(data))
    }
    await this.addVectors(vectors, documents)
  }

  /**
   * Create a New HNSWLib instance
   * @param {HNSWLibArgs} args - Constructor arguments
   * @returns {Promise<HNSWLib>}
   * @static
   */
  private static async getHierarchicalNSW(args: HNSWLibBase) {
    //const { HierarchicalNSW } = await HNSWLib.imports();
    if (!args.space) {
      throw new Error('hnswlib-node requires a space argument')
    }
    if (args.numDimensions === undefined) {
      throw new Error('hnswlib-node requires a numDimensions argument')
    }
    return new HierarchicalNSW(args.space, args.numDimensions)
  }

  /**
   * Creates a new index and adds the vectors to it
   * @param {number[][]} vectors - Array of vectors
   * @returns {Promise<void>}
   */
  private async initIndex(vectors: number[][]) {
    if (!this._index) {
      if (this.args.numDimensions === undefined) {
        this.args.numDimensions = vectors[0].length
      }
      this.index = await HNSWLib.getHierarchicalNSW(this.args)
    }
    if (!this.index.getCurrentCount()) {
      this.index.initIndex(vectors.length)
    }
  }

  public get index(): HierarchicalNSW {
    if (!this._index) {
      throw new Error(
        'Vector store not initialised yet. Try calling addTexts first.'
      )
    }
    return this._index
  }

  private set index(index: HierarchicalNSW) {
    this._index = index
  }

  /**
   * Add vectors to the index
   * @param {number[][]} vectors - Array of vectors
   * @param {Document[]} documents - Array of documents
   * @returns {Promise<void>}
   * @private
   * @async
   * @throws {Error} - If vectors and documents have different lengths
   * @throws {Error} - If vectors have different length than the number of dimensions
   * @throws {Error} - If vectors are empty
   * @throws {Error} - If index is not initialised
   * @throws {Error} - If index is full
   */
  async addVectors(vectors: number[][], documents: Document[]) {
    if (vectors.length === 0) {
      return
    }
    await this.initIndex(vectors)
    // TODO here we could optionally normalise the vectors to unit length
    // so that dot product is equivalent to cosine similarity, like this
    // https://github.com/nmslib/hnswlib/issues/384#issuecomment-1155737730
    // While we only support OpenAI embeddings this isn't necessary
    if (vectors.length !== documents.length) {
      throw new Error(`Vectors and metadatas must have the same length`)
    }
    if (vectors[0].length !== this.args.numDimensions) {
      throw new Error(
        `Vectors must have the same length as the number of dimensions (${this.args.numDimensions})`
      )
    }
    const capacity = this.index.getMaxElements()
    const needed = this.index.getCurrentCount() + vectors.length
    if (needed > capacity) {
      this.index.resizeIndex(needed)
    }
    const docstoreSize = this.docstore.count
    for (let i = 0; i < vectors.length; i += 1) {
      const id_str = documents[i].metadata?.id
      this.index.addPoint(vectors[i], HNSWLib.sha256ToDecimal(id_str))
      this.docstore.add({ [HNSWLib.sha256ToDecimal(id_str)]: documents[i] })
    }
    await this.save(this.args.filename)
    await this.saveIndex(this.args.filename)
  }

  //IMPORTANT: This function is an extension from the base class and is required for QA
  /**
   * Search for the k nearest neighbours of a query vector
   * @param {number[] or String} query - Query vector
   * @param {number} k - Number of neighbours to return
   * @returns {Promise<Document[]>} - Array of documents
   * @async
   */
  // async similaritySearch(query: any, k = 4): Promise<Document[]> {
  //   const queryEmbedding = await this.getEmbedding(query)
  //   if (queryEmbedding.length !== this.args.numDimensions) {
  //     throw new Error(
  //       `Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`
  //     )
  //   }
  //   if (k > this.index.getCurrentCount()) {
  //     const total = this.index.getCurrentCount()
  //     console.warn(
  //       `k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`
  //     )
  //     k = total
  //   }
  //   const result = this.index.searchKnn(Array.from(queryEmbedding), k)
  //   return result.neighbors.map(
  //     (docIndex, resultIndex) =>
  //       this.docstore.search(String(docIndex)) as Document
  //   )
  // }

  //Prefiltering based on query data if defined else does semantic search on all documents
  /**
   * Search for the k nearest neighbours of a query vector
   * @param {number[]} query - Query vector
   * @param {number} k - Number of neighbours to return
   * @param {Record<string, unknown>} quer_data - Query data
   * @returns {Promise<[Document, number][]>} - Array of documents and scores
   * @async
   */
  async similaritySearchVectorWithScore(
    query: number[],
    k = 10,
    quer_data: Record<string, unknown> = {}
  ): Promise<[Document, number][]> {
    let filterByLabel = (label: any) => {
      return true
    }
    if (Object.keys(quer_data).length == 0) {
      filterByLabel = label => {
        return true
      }
    } else {
      const matchingDocs = await this.getDataWithMetadata(quer_data)
      filterByLabel = label => {
        let result = false
        try {
          for (let i = 0; i < matchingDocs.length; i++) {
            const idHash = HNSWLib.sha256ToDecimal(
              (matchingDocs[i] as { id: string }).id
            )
            if (idHash === label) {
              result = true
              break
            }
          }
        } catch (e) {
          console.log(e)
        }
        return result
      }
    }

    if (query.length !== this.args.numDimensions) {
      throw new Error(
        `Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`
      )
    }
    if (k > this.index.getCurrentCount()) {
      const total = this.index.getCurrentCount()
      console.warn(
        `k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`
      )
      k = total
    }

    const result = this.index.searchKnn(Array.from(query), k, filterByLabel)
    return result.neighbors.map(
      (docIndex, resultIndex) =>
        [
          this.docstore.search(String(docIndex)),
          result.distances[resultIndex],
        ] as [Document, number]
    )
  }

  /**
   * Save the index and docstore to disk
   * @param directory
   */
  async save(directory: string) {
    await fs.promises.mkdir(directory, { recursive: true })
    await Promise.all([
      this.index.writeIndex(path.join(directory, 'hnswlib.index')),
      await fs.promises.writeFile(
        path.join(directory, 'docstore.json'),
        JSON.stringify(Array.from(this.docstore._docs.entries()))
      ),
    ])
  }

  /**
   * Saves the index to disk
   * @param filename
   * @returns {Promise<void>}
   */
  async saveIndex(filename = '.') {
    if (!this.index) {
      return
    }
    await this.index.writeIndex(path.join(filename, 'hnswlib.index'))
  }

  /**
   * Loads the index and Docstore from disk
   * @param filename
   * @returns {Promise<void>}
   */
  static async load(
    directory: string,
    embeddings: Embeddings
  ): Promise<SaveableVectorStore> {
    const db = new HNSWLib(embeddings, { space: 'cosine', filename: directory })
    db.docstore = new InMemoryDocstore()
    return db
  }

  /**
   * Loads the index and Docstore from disk
   * @param directory - Directory to load from
   * @param embeddings - Embeddings to use
   * @param args: { space: any, numDimensions: any, filename: any }
   * @returns {Promise<void>}
   * @async
   * @static
   */
  static load_data(
    directory: string,
    embeddings: Embeddings,
    args: { space: any; numDimensions: any; filename: any }
  ) {
    fs.mkdirSync(directory + '/' + args.filename, { recursive: true })
    const index = new HierarchicalNSW(args.space, args.numDimensions)
    try {
      // if docstore.json does not exist, create it with {}
      if (!fs.existsSync(directory + '/' + args.filename + '/docstore.json')) {
        console.log('docstore.json does not exist, creating it')
        const docstore = {}

        fs.writeFileSync(
          directory + '/' + args.filename + '/docstore.json',
          JSON.stringify(docstore)
        )
        index.writeIndexSync(directory + '/' + args.filename + '/hnswlib.index')
      }
      const docstoreFiles = JSON.parse(
        fs.readFileSync(
          directory + '/' + args.filename + '/docstore.json',
          'utf8'
        )
      )
      index.readIndexSync(directory + '/' + args.filename + '/hnswlib.index')
      const db = new HNSWLib(embeddings, args)
      db.index = index
      docstoreFiles.map(([k, v]) => {
        db.docstore.add({ [HNSWLib.sha256ToDecimal(v.metadata.id)]: v })
      })
      return db
    } catch (e) {
      const db = new HNSWLib(embeddings, args)
      db.docstore = new InMemoryDocstore()
      return db
    }
  }

  /**
   * Filters the documents based on the query data
   * @param query - Query data
   * @param k - Number of Events to return
   * @returns {Promise<Record<string, unknown>[]>}
   */
  async getDataWithMetadata(
    query: Record<string, unknown>,
    k = 1
  ): Promise<Record<string, unknown>[]> {
    const queryKeys = Object.keys(query)
    const matchingDocs: Record<string, unknown>[] = []
    for (const doc of this.docstore._docs.values()) {
      for (const key of queryKeys) {
        if (
          query['content'] == undefined &&
          doc.metadata['projectId'] == query['projectId']
        ) {
          matchingDocs.push(doc.metadata)
          break
        }
        if (doc.metadata[key] === query[key]) {
          if (
            doc.metadata['content'] == query['content'] &&
            doc.metadata['projectId'] == query['projectId']
          )
            matchingDocs.push(doc.metadata)
          break
        }
      }
    }
    return matchingDocs
  }

  /**
   * Creates documents from the text and metadata
   * @param text - Texts to create documents from
   * @param metadata - Metadata to create documents from
   */
  async fromString(text: string, metadata: any[]): Promise<any> {
    if (text.length > 8000) {
      const [vectors, split_docs] = await this.embeddings.embedDocuments(text)
      vectors.forEach(async (vector, index) => {
        const insert_data = [
          {
            embedding: vector,
            pageContent: split_docs[index] || 'No Content in the Event',
            data: {
              metadata: {
                ...metadata[0].metadata,
                id: uuidv4(),
                embedding: vector,
                content: split_docs[index],
              } || { msg: 'Empty Data' },
              pageContent: split_docs[index] || 'No Content in the Event',
            },
          },
        ]
        this.addEmbeddingsWithData(insert_data)
      })
      return
    }
    const vector = await this.embeddings.embedQuery(text, metadata['projectId'])
    const insert_data = [
      {
        embedding: vector,
        data: {
          metadata: { ...metadata, embedding: vector } || { msg: 'Empty Data' },
          pageContent: text || 'No Content in the Event',
        },
      },
    ]
    this.addVectors([vector], metadata)
    return insert_data
  }
  //TODO: This function is redundant and should be removed, base class requires it
  //This is handled in Documents DB.
  /**
   * Creates documents from the text and metadata
   * @param texts - Texts to create documents from
   * @param metadatas - Metadata to create documents from
   * @param embeddings - Embeddings to use
   * @param dbConfig - Database configuration
   * @returns {Promise<HNSWLib>}
   */
  static async fromTexts(
    texts: string[],
    metadatas: any[],
    embeddings: Embeddings,
    dbConfig?: {
      docstore?: InMemoryDocstore
    }
  ): Promise<HNSWLib> {
    const docs: Document[] = []
    for (let i = 0; i < texts.length; i += 1) {
      const newDoc = new Document({
        pageContent: texts[i],
        metadata: metadatas[i],
      })
      docs.push(newDoc)
    }
    return HNSWLib.fromDocuments(docs, embeddings, dbConfig)
  }

  /**
   * Creates documents from the text and embeddings
   * @param docs - Documents to create documents from
   * @param embeddings - Embeddings to use
   * @param dbConfig - Database configuration
   **/
  static async fromDocuments(
    docs: Document[],
    embeddings: Embeddings,
    dbConfig?: {
      docstore?: InMemoryDocstore
    }
  ): Promise<HNSWLib> {
    const args: HNSWLibArgs = {
      docstore: dbConfig?.docstore,
      space: 'cosine',
      filename: 'documents',
    }
    const instance = new this(embeddings, args)
    await instance.addDocuments(docs)
    return instance
  }

  /**
   * NOTE: Docstore ID and HNSWLib Label Number are same
   *The Label Number and Docstore ID are the last 6 digits of the SHA256 hash of the Event UUID
   */

  /**
   * SHA246 to decimal
   * @param str - String to convert
   * @returns {number}
   */
  static sha256ToDecimal(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex')
    const num = parseInt(hash, 16)
    return num % 1000000 // return a 6-digit integer
  }

  /**
   * SHA246 to string
   * @param str - String to convert
   * @returns {string}
   * */
  static sha256ToString(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex')
    const num = parseInt(hash, 16)
    const lastdigits = num % 1000000 // return a 6-digit integer
    return lastdigits.toString()
  }
}

export default HNSWLib
