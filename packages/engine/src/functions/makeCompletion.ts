import axios from 'axios';

const OPENAI_API_KEY = (import.meta?.env?.OPENAI_API_KEY || typeof process !== "undefined" && process?.env?.OPENAI_API_KEY) as string;
export type CompletionData = {
  prompt: string
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  apiKey?: string
}

export async function makeCompletion(
  engine: string,
  data: CompletionData
): Promise<any> {
  const {
    prompt, temperature = 0.7, max_tokens = 256, top_p = 1, frequency_penalty = 0, presence_penalty = 0, stop, apiKey,
  } = data;

  const API_KEY = apiKey || OPENAI_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  };

  const _data: any = {};
  _data.prompt = prompt;
  if (temperature && temperature !== undefined) {
    _data.temperature = temperature;
  }
  if (max_tokens && max_tokens !== undefined) {
    _data.max_tokens = max_tokens;
  }
  if (top_p && top_p !== undefined) {
    _data.top_p = top_p;
  }
  if (frequency_penalty && frequency_penalty !== undefined) {
    _data.frequency_penalty = frequency_penalty;
  }
  if (presence_penalty && presence_penalty !== undefined) {
    _data.presence_penalty = presence_penalty;
  }
  _data.stop = stop;

  try {
    const gptEngine = engine ?? 'text-davinci-002';
    console.log(
      'MAKING REQUEST TO',
      `https://api.openai.com/v1/engines/${gptEngine}/completions`
    );
    console.log('BODY', _data);

    const resp = await axios.post(
      `https://api.openai.com/v1/engines/${gptEngine}/completions`,
      _data,
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
