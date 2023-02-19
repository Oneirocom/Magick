import axios from 'axios';
import { OPENAI_API_KEY, OPENAI_ENDPOINT } from '../config';

export type EmbeddingData = {
  input: string
  model?: string
  apiKey?: string
}

export async function makeEmbedding(
  data: EmbeddingData
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

  try {
    const resp = await axios.post(
      `${OPENAI_ENDPOINT}embeddings`,
      { input, model },
      { headers: headers }
    );
    return resp.data
  } catch (err) {
    console.log('ERROR');
    console.error(err);
    return { success: false };
  }
}
