import axios from 'axios';
import { OPENAI_API_KEY } from '../config';

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

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  };

  try {
    const resp = await axios.post(
      `https://api.openai.com/v1/embeddings`,
      { input, model },
      { headers: headers }
    );

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0];
      return { success: true, choice };
    }
  } catch (err) {
    console.log('ERROR');
    console.error(err);
    return { success: false };
  }
}
