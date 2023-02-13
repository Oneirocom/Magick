import { OPENAI_API_KEY } from '@magickml/engine'
import { tts, tts_tiktalknet } from '@magickml/server-core'
import Koa from 'koa'
import { Route } from '@magickml/server-core'
import { makeCompletion } from '@magickml/engine'
import { MakeModelRequest } from './utils/MakeModelRequest'
import { queryGoogleSearch, ServerError } from '@magickml/server-core'

const getTextToSpeech = async (ctx: Koa.Context) => {
  const text = ctx.request.query.text as string
  let character = ctx.request.query.character ?? 'none'
  console.log('text and character are', text, character)
  const voice_provider = ctx.request.query.voice_provider as string
  const voice_character = ctx.request.query.voice_character as string
  const tiktalknet_url = ctx.request.query.tiktalknet_url as string

  console.log('text and character are', text, voice_character)

  let url = ''

    if (voice_provider === 'google') {
      url = await tts(text, voice_character as string)
    } else {
      url = await tts_tiktalknet(text, voice_character, tiktalknet_url)
    }

  console.log('stt url:', url)

  return (ctx.body = url)
}

const textCompletion = async (ctx: Koa.Context) => {
  const {
    modelName,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    prompt,
    stop,
    apiKey: _apiKey,
  } = ctx.request.body as any

  let apiKey = _apiKey ?? OPENAI_API_KEY

  if (!apiKey)
    throw new ServerError('authentication-error', 'No API key provided')

  const { success, choice } = await makeCompletion(modelName, {
    prompt: prompt.trim(),
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop,
    apiKey,
  })

  return (ctx.body = { success, choice })
}

const hfRequest = async (ctx: Koa.Context) => {
  const body = ctx.request.body as any
  const inputs = body.inputs as string
  const model = body.model as string
  const parameters = body.parameters as any
  const options = (body.options as any) || {
    use_cache: false,
    wait_for_model: true,
  }

  const { success, data } = await MakeModelRequest(
    inputs,
    model,
    parameters,
    options
  )

  return (ctx.body = { succes: success, data: data })
}

const queryGoogle = async (ctx: Koa.Context) => {
  const body = ctx.request.body as any
  console.log('QUERY', body?.query)
  if (!body?.query)
    throw new ServerError('input-failed', 'No query provided in request body')
  const query = body?.query as string
  const data = await queryGoogleSearch(query)
  console.log('DATA', data)
  const { summary, links } = data
  console.log('SUMMARY', summary)
  console.log('LINKS', links)
  return (ctx.body = { summary, links })
}

const image_generation = async (ctx: Koa.Context) => {
  const url = 'http://localhost:7860/sdapi/v1/txt2img'

  // proxy the request to the url and then return the respons
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ctx.request.body),
  })

  const data = await response.json()
  ctx.body = data
}

export const apis: Route[] = [
  {
    path: '/text_to_speech',
    get: getTextToSpeech,
  },
  {
    path: '/text_completion',
    post: textCompletion,
  },
  {
    path: '/hf_request',
    post: hfRequest,
  },
  {
    path: '/query_google',
    post: queryGoogle,
  },
  {
    path: '/image_generation',
    post: image_generation,
  },
]
