import axios from 'axios';
import { calculateEmbeddingCost, EmbeddingModel } from '@magickml/cost-calculator'

import { OPENAI_ENDPOINT } from '../config';
import { saveRequest, RequestData } from './saveRequest';

export type EmbeddingData = {
  input: string
  model?: string
  apiKey: string
}

export async function makeEmbedding(
  data: EmbeddingData,
  {
    projectId,
    spell,
    nodeId,
  }: RequestData
  // TODO fix call then add typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const {
    input, model = 'text-embedding-ada-002', apiKey,
  } = data;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  };

  // start a timer
  const start = Date.now()
  try {
    const resp = await axios.post(
      `${OPENAI_ENDPOINT}/embeddings`,
      { input, model },
      { headers: headers }
    );
    // end the timer
    const end = Date.now()

    const { total_tokens } = resp.data.usage

    const totalCost = calculateEmbeddingCost({tokens: total_tokens, model: EmbeddingModel.ADA_002 })

    console.log('total_tokens', total_tokens)
    console.log('totalCost', totalCost)

    saveRequest({
      projectId: projectId,
      requestData: input,
      responseData: JSON.stringify(resp.data).slice(0,10),
      duration: end - start,
      statusCode: resp.status,
      status: resp.statusText,
      model: model,
      parameters: '{}',
      type: "embedding",
      provider: "openai",
      cost: totalCost ?? 0,
      hidden: false,
      processed: false,
      spell,
      nodeId
    })
    return resp.data
  } catch (err) {
    console.log('ERROR');
    console.error(err);
    return { success: false };
  }
}
