// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import { app, Application } from '@magickml/server-core'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms'
import { QA, QAData, QAQuery } from './qa.schema'

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
  constructor(public options: QAServiceOption) {}
  async find(params?: ServiceParams): Promise<QAData[]> {
    if (app.get('vectordb')) {
      const vectorStore = app.get('vectordb')
      const model = new OpenAI({
        openAIApiKey: 'OPENAI KEY HERE',
        temperature: 0.9,
      })
      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever()
      )
      const question = params?.query?.question || 'No Question Provided in Query'
      const res = await chain.call({ question, chat_history: [] })
      return [params, res] as any
    }
    return ['Database has not been initialized yet'] as any
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
