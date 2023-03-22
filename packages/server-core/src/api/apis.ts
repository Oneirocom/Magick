import Koa from 'koa'
import solc from 'solc'
import { Route } from '../config/types'
import { tts } from '../servers/googleTextToSpeech'
import { tts_tiktalknet } from '../servers/tiktalknet'
import { ServerError } from '../utils/ServerError'

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

const image_generation = async (ctx: Koa.Context) => {
  const url = 'http://localhost:7860/sdapi/v1/txt2img'

  console.log(url)
  console.log(ctx)

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

const compileSolidity = async (ctx: Koa.Context) => {

  const { body } = ctx.request
  const { code } = body as any

  if (!body) throw new ServerError('input-failed', 'No parameters provided')

  const input = {
    language: 'Solidity',
    sources: {
      'code.sol': {
        content: code
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  ctx.response.status = 200
  return (ctx.body = {output})
}

export const apis: Route[] = [
  {
    path: '/text_to_speech',
    get: getTextToSpeech,
  },
  {
    path: '/image_generation',
    post: image_generation,
  },
  {
    path: '/ethereum/compile',
    post: compileSolidity,
  }
]
