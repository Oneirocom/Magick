// TODO: replace with a feathers service

import Koa from 'koa'
<<<<<<< refs/remotes/origin/development:packages/server-core/src/api/apis.ts
import { Route } from '../config/types'
import { tts } from '../servers/googleTextToSpeech'
import { tts_tiktalknet } from '../servers/tiktalknet'
=======
import { tts } from './googleTextToSpeech'
import { queryGoogleSearch } from './queryGoogleSearch'
import { ServerError } from './ServerError'
import { tts_tiktalknet } from './tiktalknet'
import { Route } from './types'
import solc from 'solc'

>>>>>>> add ethereum routes:packages/server-core/src/apis.ts
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
<<<<<<< refs/remotes/origin/development:packages/server-core/src/api/apis.ts
=======
const queryGoogle = async (ctx: Koa.Context) => {
  const body = ctx.request.body as any

  if (!body?.query)
    throw new ServerError('input-failed', 'No query provided in request body')
  const query = body?.query as string
  const data = await queryGoogleSearch(query)

  const { summary, links } = data


  return (ctx.body = { summary, links })
}
>>>>>>> add ethereum routes:packages/server-core/src/apis.ts

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

  var input = {
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
<<<<<<< refs/remotes/origin/development:packages/server-core/src/api/apis.ts
=======
  {
    path: '/query_google',
    post: queryGoogle,
  },
>>>>>>> add ethereum routes:packages/server-core/src/apis.ts
  {
    path: '/image_generation',
    post: image_generation,
  },
  {
    path: '/ethereum/compile',
    post: compileSolidity,
  }
]
