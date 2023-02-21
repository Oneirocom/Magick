import axios from 'axios';
import { calculateEmbeddingCost, CompletionModel } from '@magickml/cost-calculator'

import { OPENAI_API_KEY, OPENAI_ENDPOINT } from '../config';
import { saveRequest } from './saveRequest';

export type EmbeddingData = {
  input: string
  model?: string
  apiKey?: string
}

export async function makeEmbedding(
  data: EmbeddingData,
  projectId: string,
): Promise<any> {
  const {
    input, model = 'text-embedding-ada-002', apiKey,
  } = data;

  const API_KEY = apiKey || OPENAI_API_KEY;

  console.log('API_KEY', API_KEY)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
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

    const totalCost = calculateEmbeddingCost({tokens: total_tokens, model: CompletionModel.ADA })

    saveRequest({
      projectId: projectId,
      requestData: input,
      responseData: JSON.stringify(resp.data),
      duration: end - start,
      statusCode: resp.status,
      status: resp.statusText,
      model: model,
      parameters: null,
      type: "embedding",
      provider: "openai",
      cost: totalCost,
      hidden: false,
      processed: false,
    })
    return resp.data
  } catch (err) {
    console.log('ERROR');
    console.error(err);
    return { success: false };
  }
}
