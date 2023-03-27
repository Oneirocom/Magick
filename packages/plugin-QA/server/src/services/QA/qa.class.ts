// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { PaginationParams, Params, ServiceInterface } from '@feathersjs/feathers';
import { API_ROOT_URL } from '@magickml/engine';
import { app, Application } from '@magickml/server-core'
import { QA, QAData, QAQuery } from './qa.schema';
import import_ from '@brillout/import';
import { config } from 'dotenv-flow';


//Dynamic Imports



export interface QAServiceOption {
    app: Application
}

type QAParams = Params<QAQuery>

export type QAGetResponse = {
    result: any
}


export class QAService<ServiceParams extends QAParams = QAParams>
    implements ServiceInterface<QA, QAData, ServiceParams>
{
    constructor(public options: QAServiceOption) {

     }
    //@ts-ignore
    async find(params?: ServiceParams): Promise<QAData[]> {
            
            const ConversationalRetrievalQAChainPro = import_("langchain/chains");
            const { ConversationalRetrievalQAChain } = await ConversationalRetrievalQAChainPro;
            const OpenAIPro = import_("langchain/llms");
            const { OpenAI } = await OpenAIPro;
            if (app.get("vectordb")){
                let vectorStore = app.get("vectordb")
                const model = new OpenAI({ openAIApiKey: "OPENAI KEY HERE", temperature: 0.9 })
                const chain = ConversationalRetrievalQAChain.fromLLM(
                    model,
                    vectorStore.asRetriever()
                );
                //@ts-ignore
                const question = (params || {query: {question: "No Question Provided in Query"}}).query.question;
                const res = await chain.call({ question , chat_history: [] });
                return [params, res] as any;
            }
            return ["Database has not been initialized yet"] as any;
            
        }
    
}


export const getOptions = (app: Application) => {
    return { app }
}
