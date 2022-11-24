// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import axios from 'axios'

// TODO: Refactor and remove this, replace with Thoth completion node

export async function MakeCompletionRequest(
  data,
  speaker,
  agent,
  type,
  engine
) {
  // if ((await database.instance.getConfig())['use_gptj']) {
  //   const params = {
  //     temperature: 0.8,
  //     repetition_penalty: 0.5,
  //     max_length: 500,
  //     return_full_text: false,
  //     max_new_tokens: 150,
  //   }
  //   const options = {
  //     wait_for_model: true,
  //   }
  //   const response = await makeModelRequest(
  //     data.prompt,
  //     'EleutherAI/gpt-j-6B',
  //     params,
  //     options
  //   )
  //   console.log('response', response.body)
  //   const responseModified = {
  //     success: true,
  //     choice: { text: response[0].generated_text.split('\n')[0] },
  //   }
  //   return responseModified
  // } else {
  return await makeOpenAIGPT3Request(data, speaker, agent, type, engine)
  // }
}
const useDebug = false
async function makeOpenAIGPT3Request(data, speaker, agent, type, engine) {
  if (useDebug) return { success: true, choice: { text: 'Default response' } }
  const API_KEY = process.env.OPENAI_API_KEY
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

export async function makeCompletion(
  engine: string,
  data: {
    prompt: string,
    temperature: number = 0.7,
    max_tokens: number = 256,
    top_p: number = 1,
    frequency_penalty: number = 0,
    presence_penalty: number = 0,
    stop: string[],
  }
): Promise<any> {
  const API_KEY =
    process.env.OPENAI_API_KEY

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  }

  console.log("API KEYS", headers)

  const _data = {}
  _data.prompt = data.prompt
  if (data.temperature && data.temperature !== undefined) {
    _data.temperature = data.temperature
  }
  if (data.max_tokens && data.max_tokens !== undefined) {
    _data.max_tokens = data.max_tokens
  }
  if (data.top_p && data.top_p !== undefined) {
    _data.top_p = data.top_p
  }
  if (data.frequency_penalty && data.frequency_penalty !== undefined) {
    _data.frequency_penalty = data.frequency_penalty
  }
  if (data.presence_penalty && data.presence_penalty !== undefined) {
    _data.presence_penalty = data.presence_penalty
  }
  _data.stop = data.stop

  try {
    const gptEngine = engine ?? 'text-davinci-002'
    console.log("MAKING REQUEST TO", `https://api.openai.com/v1/engines/${gptEngine}/completions`)
    console.log('BODY', _data)

    const resp = await axios.post(
      `https://api.openai.com/v1/engines/${gptEngine}/completions`,
      _data,
      { headers: headers }
    )

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return { success: true, choice }
    }
  } catch (err) {
    console.log("ERROR")
    console.error(err)
    return { success: false }
  }
}