
import HNSWLib, { PostgressVectorStoreCustom } from "./vectordb"
import { PluginEmbeddings } from './customEmbeddings';
<<<<<<< HEAD
import { Embeddings } from "langchain/dist/embeddings/base";
=======
import { Embeddings } from "langchain/embeddings";
>>>>>>> a04d3a0bce7731b31c19a46012dc7fb27c86fe6f

export async function setupDB(db) {
    const embeddings = new PluginEmbeddings({}) as unknown as Embeddings
    if (process.env.DATABASE_TYPE == 'sqlite') {
        console.log('Setting up vector store')
        const vectordb = HNSWLib.load_data('.', embeddings, {
            space: 'cosine',
            numDimensions: 1536,
            filename: 'database',
        })
        const docdb = HNSWLib.load_data('.', embeddings, {
            space: 'cosine',
            numDimensions: 1536,
            filename: 'documents',
        })
        return {vectordb, docdb}
    } else {
        const vectordb = new PostgressVectorStoreCustom(embeddings, {
            client: db,
            tableName: 'events',
            queryName: 'match_events',
        })
        const docdb = new PostgressVectorStoreCustom(embeddings, {
            client: db,
            tableName: 'documents',
            queryName: 'match_documents',
        })
        return {vectordb, docdb}
    }

    
}

