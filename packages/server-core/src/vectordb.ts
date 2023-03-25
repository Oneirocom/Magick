import fs from 'fs';
import path from "node:path";
import {
  HierarchicalNSW,
  HierarchicalNSW as HierarchicalNSWT,
  SpaceName,
} from "hnswlib-node";
import { Embeddings } from "langchain/dist/embeddings/base";
import {Document} from "langchain/document"
//import { Document } from "langchain/dist/document";
//import InMemoryDocstore from "langchain";
import { InMemoryDocstore } from "langchain/docstore";
import { result } from "lodash";
import { SaveableVectorStore } from 'langchain/dist/vectorstores';
//import { InMemoryDocstore } from "langchain/dist/docstore";
//import {SaveableVectorStore} from "langchain";
//import { SaveableVectorStore } from "langchain/vectorstores";
//import { SaveableVectorStore } from "langchain/dist/vectorstores/base";
//import Document from "langchain"



export interface HNSWLibBase {
  space: SpaceName;
  numDimensions?: number;
}

export interface HNSWLibArgs extends HNSWLibBase {
  docstore?: InMemoryDocstore;
  index?: HierarchicalNSWT;
}

export interface EmbeddingWithData {
  embedding: number[] | null;
  data: Record<string, unknown>;
}

export class HNSWLib extends SaveableVectorStore{
  _index?: HierarchicalNSWT;

  docstore: InMemoryDocstore;

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
  async add(id:any, embedding:any, a:any="sss") {}
  async search(a:any, b:any){}
  async searchData(a:any, b:any){}
  async delete(a:any){}
  async extractMetadataFromResults(query: number[], k: number): Promise<Record<string, unknown>[]> {
    const results = await this.similaritySearchVectorWithScore(query, k);
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
    this.index.addPoint(embedding, docstoreSize);
    this.docstore.add({ [docstoreSize]: metadata });
    await this.save("./database")
    await this.saveIndex();
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
    const { HierarchicalNSW } = await HNSWLib.imports();
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
      this.index.addPoint(vectors[i], docstoreSize + i);
      this.docstore.add({ [docstoreSize + i]: documents[i] });
    }
    await this.save("./database")
    await this.saveIndex();
  }

  async similaritySearchVectorWithScore(query: number[], k: number): Promise<[Document, number][]> {
    if (query.length !== this.args.numDimensions) {
      throw new Error(`Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`);
    }
    if (k > this.index.getCurrentCount()) {
      const total = this.index.getCurrentCount();
      console.warn(`k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`);
      k = total;
    }
    const result = this.index.searchKnn(Array.from(query), k);
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

  async saveIndex() {
    if (!this.index) {
      return;
    }
    await this.index.writeIndex(path.join(".", "hnswlib.index"));
  }
  static async load(directory: string, embeddings: Embeddings): Promise<SaveableVectorStore> {
    let db = new HNSWLib(embeddings, {space: "cosine"});
    db.docstore = new InMemoryDocstore();
    return db;
  }
  static load_data(directory: string, embeddings: Embeddings, args:{space: any, numDimensions: any}) {
    const index = new HierarchicalNSW(args.space, args.numDimensions);
    try {
        const docstoreFiles = JSON.parse(fs.readFileSync(path.join(directory, "docstore.json"), "utf8"));
        index.readIndex(path.join(directory, "hnswlib.index"));
        let db = new HNSWLib(embeddings, args);
        db.index = index;
        let doc_map = docstoreFiles.map(([k,v])=>{
          return {
           ...v
          }
        })
        db.docstore.add(doc_map)
        return db;
    } catch {
        let db = new HNSWLib(embeddings, args);
        db.docstore = new InMemoryDocstore();
        return db;
    }
}
  async getDataWithMetadata(query: Record<string, unknown>, k: number=1): Promise<Record<string, unknown>[]> {
    const queryKeys = Object.keys(query);
    const matchingDocs: Record<string, unknown>[] = [];
    for (const doc of this.docstore._docs.values()) {
      for (const key of queryKeys) {
        if (doc.metadata[key] === query[key]) {
          matchingDocs.push(doc.metadata);
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
      docstore?: InMemoryDocstore;
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
      docstore?: InMemoryDocstore;
    }
  ): Promise<HNSWLib> {
    const args: HNSWLibArgs = {
      docstore: dbConfig?.docstore,
      space: "cosine",
    };
    const instance = new this(embeddings, args);
    await instance.addDocuments(docs);
    return instance;
  }


  static async fromEmbeddingsWithData(
    embeddings: EmbeddingWithData[],
    embeddingsModel: Embeddings,
    dbConfig?: {
      docstore?: InMemoryDocstore;
    }
  ): Promise<HNSWLib> {
    const args: HNSWLibArgs = {
      docstore: dbConfig?.docstore,
      space: "cosine",
    };
    const instance = new this(embeddingsModel, args);
    await instance.addEmbeddingsWithData(embeddings);
    return instance;
  }

  static async imports(): Promise<{
    HierarchicalNSW: typeof HierarchicalNSWT;
  }> {
    try {
      const {
        default: { HierarchicalNSW },
      } = await import("hnswlib-node");

      return { HierarchicalNSW };
    } catch (err) {
      throw new Error(
        "Please install hnswlib-node as a dependency with, e.g. npm install -S hnswlib-node"
      );
    }
  }
}

export default HNSWLib;
