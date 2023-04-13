
import { CompletionProvider, pluginManager, WorkerData } from "@magickml/core";

import import_ from '@brillout/import';
import { toUpper } from "lodash";
const EmbeddingsPro = import_("langchain/embeddings");
const { Embeddings } = await EmbeddingsPro;
export const chunkArray = (arr, chunkSize) => arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    const chunk = chunks[chunkIndex] || [];
    // eslint-disable-next-line no-param-reassign
    chunks[chunkIndex] = chunk.concat([elem]);
    return chunks;
}, []);

export class PluginEmbeddings extends Embeddings {
    handler: CompletionProvider["handler"];
    stripNewLines: any;
    modelName: string;
    batchSize: number;
    caller: any;
    key: any;
    constructor(params) {
        super(params ?? {})
        this.key = {};
        const [completionProviders, secrets]  = pluginManager.getCompletionProvidersWithSecrets('text', [
            'embedding',
        ]);
        this.modelName = params.model || completionProviders[0].models[0];
        this.batchSize = params.batchSize ?? 32
        // Get the provider for the selected model.
        secrets[0].forEach((secret) => {
            this.key[secret.key] = process.env[toUpper(secret.key)]
        })
        const provider = completionProviders.find(provider =>
        provider.models.includes(this.modelName),
        ) as CompletionProvider;

        //Set the handler
        this.handler = provider.handler;
    }

    static getModels(): string[] {
        const completionProviders = pluginManager.getCompletionProviders('text', [
            'embedding',
        ]) as CompletionProvider[];
        return completionProviders.map(provider => provider.models).flat();
        
    }

    async embedQuery(document: string): Promise<number[]> {
        const data = await this.embeddingWithRetry({
            model: this.modelName,
            input: [document],
        });
        console.log("Reutrn data")
        console.log(data)
        return data.result;
    }
    async embedDocuments(document: string[]): Promise<number[][]> {
        const subPrompts = chunkArray(this.stripNewLines ? document.map((t) => t.replaceAll("\n", " ")) : document, this.batchSize);
        const embeddings = [];
        for (let i = 0; i < subPrompts.length; i += 1) {
            const input = subPrompts[i];
            const { data } = await this.embeddingWithRetry({
                input: input as String,
            });
            for (let j = 0; j < input.length; j += 1) {
                embeddings.push(data.data[j].embedding);
            }
        }
        return embeddings;
    }
    async embeddingWithRetry(embeddingObject) {
        let response;
        let retry = 0;
        while (retry < 3) {
            try {
                console.log("retrying")
                response = await this.handler({
                    //@ts-ignore
                    inputs: {input: [{content: embeddingObject['input']}]},
                    node: { data: { model: this.modelName } } as unknown as WorkerData,
                    outputs: undefined,
                    context: {module: {secrets: this.key}},
                });
                console.log(response)
                break;
            } catch (e) {
                console.log("ERRRORR")
                console.log(e)
                retry += 1;
            }
        }
        return response;
    }
    async get_embeddings(words: string[]): Promise<number[][]> {
        return words.map((word) => {
        const vec = new Array(1536).fill(0);
        vec[0] = word.length;
        return vec;
        });
    }

}