/* 

This code is adapted from the langchainjs library under the MIT license.
The original library can be found at https://github.com/hwchase17/langchainjs.

*/

import fs from 'fs';
import * as crypto from "crypto"
import path from "node:path";
import {
  HierarchicalNSW,
  HierarchicalNSW as HierarchicalNSWT,
  SpaceName,
} from "hnswlib-node";
import { Embeddings } from "langchain/dist/embeddings/base";
import { extend, result } from "lodash";
import import_ from '@brillout/import';


//Using dynamic Imports, Resolving the imports into Promise and then waiting for them to resolve
//direct import await, causing the Featherjs application creation to stall
const InMemoryDocstorePro = import_("langchain/docstore");
const { InMemoryDocstore } = await InMemoryDocstorePro;
const DocumentPro = import_("langchain/document");
const { Document } = await DocumentPro;
const SaveableVectorStorePro = import_("langchain/vectorstores");
const { SaveableVectorStore } = await SaveableVectorStorePro;
const SupabaseVectorStorePro = import_("langchain/vectorstores");
const { SupabaseVectorStore } = await SupabaseVectorStorePro;

export class SupabaseVectorStoreCustom extends SupabaseVectorStore {
  constructor(embeddings, args) {
    super(embeddings, args);
    Object.defineProperty(this, "client", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
    });
    Object.defineProperty(this, "tableName", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
    });
    Object.defineProperty(this, "queryName", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
    });
    this.client = args.client;
    this.tableName = args.tableName || "documents";
    this.queryName = args.queryName || "match_documents";
  }
  async addDocuments(documents, vector: any='') {
    const texts = documents.map(({ pageContent }) => pageContent);
    if (vector != '') {
      return this.addVectors(vector, documents)
    }
    return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
  }
  async addVectors(vectors, documents) {
          const res = await this.client.from(this.tableName).insert(documents);
          if (res.error) {
              throw new Error(`Error inserting: ${res.error.message} ${res.status} ${res.statusText}`);
          }
  }

  async addEvents(events) {
    events.array.forEach(async element => {
      const res = await this.client.from(this.tableName).insert(element);
      if (res.error) {
          throw new Error(`Error inserting: ${res.error.message} ${res.status} ${res.statusText}`);
      }
    });
  }

  rpc(query, params) {
    return this.client.rpc(query, params);
  }

  from(table) {
    return this.client.from(table);
  }

  async getDocuments(ids) {
    const res = await this.client.from(this.tableName).select("*").in("id", ids);
    if (res.error) {
        throw new Error(`Error getting documents: ${res.error.message} ${res.status} ${res.statusText}`);
    }
    return res.data;
  }
}
export type Document = {
  id(id: any): number;
  metadata: Object,
  pageContent: any
}
export interface HNSWLibBase {
  filename: string;
  space: SpaceName;
  numDimensions?: number;
}

export interface HNSWLibArgs extends HNSWLibBase {
  docstore?: typeof InMemoryDocstore;
  index?: HierarchicalNSWT;
}

export interface EmbeddingWithData {
  embedding: number[] | null;
  data: Record<string, unknown>;
}

export class HNSWLib extends SaveableVectorStore {
  _index?: HierarchicalNSWT;

  docstore: typeof InMemoryDocstore;

  args: HNSWLibBase;

  declare embeddings: Embeddings;

  constructor(embeddings: Embeddings, args: HNSWLibArgs) {
    super(embeddings, args);
    this._index = args.index;
    this.args = args;
    this.embeddings = embeddings;
    this.docstore = args?.docstore ?? new InMemoryDocstore();
  }

  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    );
  }
  async add(id: any, embedding: any, a: any = "sss") { }
  async search(a: any, b: any) { }
  async searchData(a: any, b: any) { }
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

  async extractMetadataFromResults(query: number[], k: number, query_data: Record<string, unknown> = {}): Promise<Record<string, any>> {
    const results = await this.similaritySearchVectorWithScore(query, k, query_data);
    return results.map(([doc, _]) => doc.metadata);
  }
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


  async addEmbeddingsWithData(embeddings: EmbeddingWithData[]): Promise<void> {
    const vectors: number[][] = [];
    const documents: Document[] = [];
    for (const { embedding, data } of embeddings) {
      if (embedding) {
        if (embedding.length !== this.args.numDimensions) {
          throw new Error(
            `Embedding must have the same length as the number of dimensions (${this.args.numDimensions})`
          );
        }
        vectors.push(embedding);
      }
      documents.push(new Document(data));
    }

    await this.addVectors(vectors, documents);
  }



  private static async getHierarchicalNSW(args: HNSWLibBase) {
    //const { HierarchicalNSW } = await HNSWLib.imports();
    if (!args.space) {
      throw new Error("hnswlib-node requires a space argument");
    }
    if (args.numDimensions === undefined) {
      throw new Error("hnswlib-node requires a numDimensions argument");
    }
    return new HierarchicalNSW(args.space, args.numDimensions);
  }

  private async initIndex(vectors: number[][]) {
    if (!this._index) {
      if (this.args.numDimensions === undefined) {
        this.args.numDimensions = vectors[0].length;
      }
      this.index = await HNSWLib.getHierarchicalNSW(this.args);
    }
    if (!this.index.getCurrentCount()) {
      this.index.initIndex(vectors.length);
    }
  }

  public get index(): HierarchicalNSWT {
    if (!this._index) {
      throw new Error(
        "Vector store not initialised yet. Try calling addTexts first."
      );
    }
    return this._index;
  }

  private set index(index: HierarchicalNSWT) {
    this._index = index;
  }

  async addVectors(vectors: number[][], documents: Document[]) {
    if (vectors.length === 0) {
      return;
    }
    await this.initIndex(vectors);
    // TODO here we could optionally normalise the vectors to unit length
    // so that dot product is equivalent to cosine similarity, like this
    // https://github.com/nmslib/hnswlib/issues/384#issuecomment-1155737730
    // While we only support OpenAI embeddings this isn't necessary
    if (vectors.length !== documents.length) {
      throw new Error(`Vectors and metadatas must have the same length`);
    }
    if (vectors[0].length !== this.args.numDimensions) {
      throw new Error(
        `Vectors must have the same length as the number of dimensions (${this.args.numDimensions})`
      );
    }
    const capacity = this.index.getMaxElements();
    const needed = this.index.getCurrentCount() + vectors.length;
    if (needed > capacity) {
      this.index.resizeIndex(needed);
    }

    const docstoreSize = this.docstore.count;
    for (let i = 0; i < vectors.length; i += 1) {
      //@ts-ignore
      let id_str = documents[i].metadata?.id;
      this.index.addPoint(vectors[i], HNSWLib.sha256ToDecimal(id_str));
      this.docstore.add({ [HNSWLib.sha256ToDecimal(id_str)]: documents[i] });
    }
    await this.save(this.args.filename)
    await this.saveIndex(this.args.filename);
  }

  async similaritySearch(query: any, k = 4): Promise<Document[]> {
    const arrayLength = this.args.numDimensions;
    query = new Array(arrayLength).fill(null).map(() => Math.random());
    /* if (query.length !== this.args.numDimensions) {
      throw new Error(`Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`);
    } */
    if (k > this.index.getCurrentCount()) {
      const total = this.index.getCurrentCount();
      console.warn(`k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`);
      k = total;
    }
    const result = this.index.searchKnn(Array.from(query), k);
    return result.neighbors.map(
      (docIndex, resultIndex) =>
        this.docstore.search(String(docIndex)) as Document
    );
  }


  async similaritySearchVectorWithScore(query: number[],k = 10, quer_data: Record<string, unknown> = {}): Promise<[Document, number][]> {
    var filterByLabel = (label: any) => {return true}
    if (Object.keys(quer_data).length == 0) {
      filterByLabel = (label) => {return true}
    } else {
      var matchingDocs = await this.getDataWithMetadata(quer_data);
      filterByLabel = (label) => {
        let result = false;
        try {
          for (let i = 0; i < matchingDocs.length; i++) {

            const idHash = HNSWLib.sha256ToDecimal((matchingDocs[i] as {id: String}).id);
            if (idHash === label) {
              result = true;
              break;
            }
          }
        } catch(e) {
            console.log(e)
        }
        return result;
      };
    }
    
    if (query.length !== this.args.numDimensions) {
      throw new Error(`Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`);
    }
    if (k > this.index.getCurrentCount()) {
      const total = this.index.getCurrentCount();
      console.warn(`k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`);
      k = total;
    }
    
    const result = this.index.searchKnn(Array.from(query), k, filterByLabel);
    return result.neighbors.map(
      (docIndex, resultIndex) =>
        [this.docstore.search(String(docIndex)), result.distances[resultIndex]] as [Document, number]
    );
  }


  async save(directory: string) {
    await fs.promises.mkdir(directory, { recursive: true });
    await Promise.all([
      this.index.writeIndex(path.join(directory, "hnswlib.index")),
      await fs.promises.writeFile(
        path.join(directory, "docstore.json"),
        JSON.stringify(Array.from(this.docstore._docs.entries()))
      ),
    ]);
  }

  async saveIndex(filename:string=".") {
    if (!this.index) {
      return;
    }
    await this.index.writeIndex(path.join(filename, "hnswlib.index"));
  }
  static async load(directory: string, embeddings: Embeddings): Promise<typeof SaveableVectorStore> {
    let db = new HNSWLib(embeddings, { space: "cosine", filename: directory });
    db.docstore = new InMemoryDocstore();
    return db;
  }
  static load_data(directory: string, embeddings: Embeddings, args: { space: any, numDimensions: any, filename: any }) {
    const index = new HierarchicalNSW(args.space, args.numDimensions);
    try {
      const docstoreFiles = JSON.parse(fs.readFileSync(args.filename + "/docstore.json", "utf8"));
      index.readIndex(args.filename +"/hnswlib.index");
      let db = new HNSWLib(embeddings, args);
      db.index = index;
      docstoreFiles.map(([k, v]) => {
        db.docstore.add({ [HNSWLib.sha256ToDecimal(v.metadata.id)]: v });
      })
      return db;
    } catch (e) {
      console.log("Error Caught: ", e)
      let db = new HNSWLib(embeddings, args);
      db.docstore = new InMemoryDocstore();
      return db;
    }
  }
  async getDataWithMetadata(query: Record<string, unknown>, k: number = 1): Promise<Record<string, unknown>[]> {
    const queryKeys = Object.keys(query);
    const matchingDocs: Record<string, unknown>[] = [];
    //console.log(this.docstore._docs.entries())
    for (const doc of this.docstore._docs.values()) {
      for (const key of queryKeys) {
        
        if ((query["content"] == undefined) && (doc.metadata["projectId"] == query["projectId"])) {
          //console.log(doc.metadata[key], query[key])
          matchingDocs.push(doc.metadata);
          break;
        }
        if ((doc.metadata[key] === query[key])) {
          if ((doc.metadata["content"] == query["content"]) && (doc.metadata["projectId"] == query["projectId"])) matchingDocs.push(doc.metadata);
          break;
        }
      }
    }
    return matchingDocs;
  }

  static async fromTexts(
    texts: string[],
    metadatas: object[],
    embeddings: Embeddings,
    dbConfig?: {
      docstore?: typeof InMemoryDocstore;
    }
  ): Promise<HNSWLib> {
    const docs: Document[] = [];
    for (let i = 0; i < texts.length; i += 1) {
      const newDoc = new Document({
        pageContent: texts[i],
        metadata: metadatas[i],
      });
      docs.push(newDoc);
    }
    return HNSWLib.fromDocuments(docs, embeddings, dbConfig);
  }

  static async fromDocuments(
    docs: Document[],
    embeddings: Embeddings,
    dbConfig?: {
      docstore?: typeof InMemoryDocstore;
    }
  ): Promise<HNSWLib> {
    const args: HNSWLibArgs = {
      docstore: dbConfig?.docstore,
      space: "cosine",
      filename: "documents"
    };
    const instance = new this(embeddings, args);
    await instance.addDocuments(docs);
    return instance;
  }

  static sha256ToDecimal(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    const num = parseInt(hash, 16);
    return num % 1000000; // return a 6-digit integer
  }
}

export default HNSWLib;
