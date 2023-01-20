import { OPENAI_API_KEY } from '@magickml/server-core'
import axios from 'axios'

export async function MakeCompletionRequest(
  data: any,
  engine: any,
  apiKey: string
) {
  return await makeOpenAIGPT3Request(data, engine, apiKey)
}
const useDebug = false
async function makeOpenAIGPT3Request(
  data: any,
  engine: any,
  apiKey: string
) {
  if (useDebug) return { success: true, choice: { text: 'Default response' } }
  const API_KEY = (apiKey !== '' && apiKey) ?? OPENAI_API_KEY
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  }
  try {
    const gptEngine = engine ?? 'davinci'
    const resp = await axios.post(
      `https://api.openai.com/v1/engines/${gptEngine}/completions`,
      data,
      { headers: headers }
    )

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return { success: true, choice }
    }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}


