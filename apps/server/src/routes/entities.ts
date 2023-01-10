import { database } from '@magickml/database'
import 'regenerator-runtime/runtime'
// import weaviate from 'weaviate-client'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { Route } from '../types'
import { makeCompletion } from '../utils/MakeCompletionRequest'
import { MakeModelRequest } from '../utils/MakeModelRequest'
import { queryGoogleSearch } from '../routes/utils/queryGoogle'
import { tts, tts_tiktalknet } from '@magickml/systems'
import { prisma } from '@magickml/prisma'
import { CustomError } from '../utils/CustomError'

export const modules: Record<string, unknown> = {}

const getEntitiesHandler = async (ctx: Koa.Context) => {
  try {
    let data = await prisma.entities.findMany()
    return (ctx.body = data)
  } catch (e) {
    console.log('getEntitiesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const getEntityHandler = async (ctx: Koa.Context) => {
  const instanceId = ctx.request.query.instanceId as string
  if (!instanceId) {
    ctx.status = 400
    return (ctx.body = { error: 'missing instanceId' })
  }

  const isNum = /^\d+$/.test(instanceId)
  if (!isNum) {
    ctx.status = 400
    return (ctx.body = { error: 'instanceId is not a number' })
  }

  const _instanceId = parseInt(instanceId)
  try {
    let data = (await database.getEntity(_instanceId)) as any
    if (data === undefined || !data) {
      let newId = _instanceId
      while ((await database.entityExists(newId)) || newId <= 0) {
        newId++
      }

      data = {
        id: newId,
        enabled: true,
      }
    }
    return (ctx.body = data)
  } catch (e) {
    console.log('getEntityHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const addEntityHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body
  if (!data.data) {
    data.data = ''
    data.dirty = true
    data.enabled = false
  }

  if (typeof data.data === 'object') {
    data.data = JSON.stringify(data.data)
  }

  const entity = await prisma.entities.findFirst({
    where: {
      id: data.id,
    },
  })

  // if entity exists, update it
  if (entity) {
    await prisma.entities.update({
      where: {
        id: data.id,
      },
      data: {
        id: data.id,
        data: data.data as string,
        dirty: true,
        enabled: data.enabled,
      },
    })

    return (ctx.body = { id: data.id })
  }

  try {
    return (ctx.body = await prisma.entities.create({ data }))
  } catch (e) {
    console.log('addEntityHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteEntityHandler = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  console.log('deleteEntityHandler', deleteEntityHandler)

  try {
    return (ctx.body = await database.deleteEntity(id))
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const getEvent = async (ctx: Koa.Context) => {
  const type = ctx.request.query.type as string
  const agent = ctx.request.query.agent as string
  const speaker = ctx.request.query.speaker as string
  const client = ctx.request.query.client as string
  const channel = ctx.request.query.channel as string
  const maxCount = parseInt(ctx.request.query.maxCount as string)
  const max_time_diff = parseInt(ctx.request.query.max_time_diff as string)

  const event = await database.getEvents({
    type,
    agent,
    speaker,
    client,
    channel,
    maxCount,
    max_time_diff,
  })

  return (ctx.body = { event })
}

const getAllEvents = async (ctx: Koa.Context) => {
  try {
    const events = await database.getAllEvents()
    return (ctx.body = events)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}
const deleteEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if (!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }
    const res = await database.deleteEvent(parseInt(id))
    return (ctx.body = true)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const updateEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if (!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }

    const agent = ctx.request.body.agent
    const speaker = ctx.request.body.speaker
    const sender = ctx.request.body.sender
    const client = ctx.request.body.client
    const channel = ctx.request.body.channel
    const text = ctx.request.body.text
    const type = ctx.request.body.type
    const date = ctx.request.body.date

    const res = await database.updateEvent(id, {
      agent,
      speaker,
      sender,
      client,
      channel,
      text,
      type,
      date,
    })
    return (ctx.body = res)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const createEvent = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const sender = ctx.request.body.sender
  const channel = ctx.request.body.channel
  const text = ctx.request.body.text
  const type = ctx.request.body.type
  console.log('Creating event:', agent, speaker, client, channel, text, type)

  // Todo needs error handling
  await database.createEvent({
    type,
    agent,
    speaker,
    sender,
    client,
    channel,
    text,
  })

  return (ctx.body = 'ok')
}

const getTextToSpeech = async (ctx: Koa.Context) => {
  const text = ctx.request.query.text as string
  let character = ctx.request.query.character ?? 'none'
  console.log('text and character are', text, character)
  const voice_provider = ctx.request.query.voice_provider as string
  const voice_character = ctx.request.query.voice_character as string
  // const voice_language_code = ctx.request.query.voice_language_code
  const tiktalknet_url = ctx.request.query.tiktalknet_url as string

  console.log('text and character are', text, voice_character)

  let url = ''

  //@ts-ignore
  if (!cache && cache.length <= 0) {
    if (voice_provider === 'google') {
      url = await tts(text, voice_character as string)
    } else {
      url = await tts_tiktalknet(text, voice_character, tiktalknet_url)
    }
  }

  console.log('stt url:', url)

  return (ctx.body = url)
}

const textCompletion = async (ctx: Koa.Context) => {
  const modelName = ctx.request.body.modelName as string
  const temperature = ctx.request.body.temperature as number
  const maxTokens = ctx.request.body.maxTokens as number
  const topP = ctx.request.body.topP as number
  const frequencyPenalty = ctx.request.body.frequencyPenalty as number
  const presencePenalty = ctx.request.body.presencePenalty as number
  const sender = (ctx.request.body.sender as string) ?? 'User'
  const agent = (ctx.request.body.agent as string) ?? 'Agent'
  const prompt = (ctx.request.body.prompt as string)
    .replace('{agent}', agent)
    .replace('{speaker}', sender)
  let stop = (ctx.request.body.stop ?? ['']) as string[]
  const openaiApiKey =
    (ctx.request.body.apiKey as string) ?? process.env.OPENAI_API_KEY

  if (!openaiApiKey)
    throw new CustomError('authentication-error', 'No API key provided')

  if (!stop || stop.length === undefined || stop.length <= 0) {
    stop = ['"""', '###']
  }

  const { success, choice } = await makeCompletion(modelName, {
    prompt: prompt.trim(),
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop: stop,
    apiKey: openaiApiKey,
  })

  return (ctx.body = { success, choice })
}

const hfRequest = async (ctx: Koa.Context) => {
  const inputs = ctx.request.body.inputs as string
  const model = ctx.request.body.model as string
  const parameters = ctx.request.body.parameters as any
  const options = (ctx.request.body.options as any) || {
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

// const makeWeaviateRequest = async (ctx: Koa.Context) => {
//   const keyword = ctx.request.body.keyword as string

//   const client = weaviate.client({
//     scheme: 'http',
//     host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
//   })

//   const res = await client.graphql
//     .get()
//     .withNearText({
//       concepts: [keyword],
//       certainty: 0.75,
//     })
//     .withClassName('Paragraph')
//     .withFields('title content inArticle { ... on Article {  title } }')
//     .withLimit(3)
//     .do()

//   console.log('RESPONSE', res)

//   if (res?.data?.Get !== undefined) {
//     return (ctx.body = { data: res.data.Get })
//   }
//   return (ctx.body = { data: '' })
// }

const getEntitiesInfo = async (ctx: Koa.Context) => {
  const id = (ctx.request.query.id as string)
    ? parseInt(ctx.request.query.id as string)
    : -1

  try {
    let data = await database.getEntities()
    let info = undefined
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        info = data[i]
      }
    }

    return (ctx.body = info)
  } catch (e) {
    console.log('getEntitiesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const queryGoogle = async (ctx: Koa.Context) => {
  console.log('QUERY', ctx.request?.body?.query)
  if (!ctx.request?.body?.query)
    throw new CustomError('input-failed', 'No query provided in request body')
  const query = ctx.request.body?.query as string
  const result = await queryGoogleSearch(query)

  ctx.body = {
    result,
  }
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

export const entities: Route[] = [
  {
    path: '/entities',
    get: getEntitiesHandler,
  },
  {
    path: '/entity',
    get: getEntityHandler,
    post: addEntityHandler,
  },
  {
    path: '/entity/:id',
    delete: deleteEntityHandler,
  },
  {
    path: '/event',
    get: getEvent,
    post: createEvent,
  },
  {
    path: '/event/:id',
    delete: deleteEvent,
    put: updateEvent,
  },
  {
    path: '/events',
    get: getAllEvents,
  },
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
  // {
  //   path: '/weaviate',
  //   post: makeWeaviateRequest,
  // },
  {
    path: '/entities_info',
    get: getEntitiesInfo,
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
