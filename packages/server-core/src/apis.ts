// TODO: replace with a feathers service

import Koa from 'koa'
import { tts } from './googleTextToSpeech'
import { queryGoogleSearch } from './queryGoogleSearch'
import { ServerError } from './ServerError'
import { tts_tiktalknet } from './tiktalknet'
import { Route } from './types'
const getTextToSpeech = async (ctx: Koa.Context) => {
  const text = ctx.request.query.text as string
  
  const voice_provider = ctx.request.query.voice_provider as string
  const voice_character = ctx.request.query.voice_character as string
  const tiktalknet_url = ctx.request.query.tiktalknet_url as string

  let url = ''

    if (voice_provider === 'google') {
      url = await tts(text, voice_character as string)
    } else {
      url = await tts_tiktalknet(text, voice_character, tiktalknet_url)
    }

  return (ctx.body = url)
}
const queryGoogle = async (ctx: Koa.Context) => {
  const body = ctx.request.body as any
  
  if (!body?.query)
    throw new ServerError('input-failed', 'No query provided in request body')
  const query = body?.query as string
  const data = await queryGoogleSearch(query)
  
  const { summary, links } = data
  
  
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
    path: '/query_google',
    post: queryGoogle,
  },
  {
    path: '/image_generation',
    post: image_generation,
  },
]
