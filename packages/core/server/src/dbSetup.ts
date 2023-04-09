import { createClient } from "@supabase/supabase-js"
import HNSWLib, { SupabaseVectorStoreCustom } from "./vectordb"
import { PluginEmbeddings } from './customEmbedding';
import { Embeddings } from "langchain/dist/embeddings/base";
//Dynamic Import using top lvl await



export async function setupDB() {
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
        const cli = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
        const vectordb = new SupabaseVectorStoreCustom(embeddings, {
            client: cli,
            tableName: 'events',
            queryName: 'match_events',
        })
        const docdb = new SupabaseVectorStoreCustom(embeddings, {
            client: cli,
            tableName: 'documents',
            queryName: 'match_documents',
        })
        return {vectordb, docdb}
    }

    
}

