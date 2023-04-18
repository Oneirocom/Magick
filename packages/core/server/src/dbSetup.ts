
import HNSWLib, { PostgressVectorStoreCustom } from "./vectordb"
import { PluginEmbeddings } from './customEmbeddings';
import { Embeddings } from "langchain/embeddings";

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

