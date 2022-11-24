import { noAuth } from '../../middleware/auth'
import Koa from 'koa'
import { Route } from 'src/types'

const defaultOptions = {
  model: 'davinci-cached',
  presencePenalty: 0.0,
  temperature: 0.7,
  maxTokens: 120,
  n: 1,
  logitBias: {},
}

export type CompletionRequest = any

export const completionsParser = async (
  completionRequest: CompletionRequest
) => {
  const {
    context,
    getFullResponse,
    modelSource = 'openai',
    universalFormat = false,
    ...options
  } = completionRequest
  if (!options) throw console.error('input-failed', 'No parameters provided')

  if (!(modelSource in ModelSources))
    throw console.error('input-failed', 'Model source not supported')
  return context
}

const completionsHandler = async (ctx: Koa.Context) => {
  const {
    context,
    getFullResponse,
    modelSource = 'openai',
    ...options
  } = (ctx.request as any).body

  const completion = await completionsParser({
    context,
    getFullResponse,
    modelSource,
    ...options,
  })
  ctx.body = completion
}

export const completions: Route[] = [
  {
    path: '/completions',
    access: noAuth,
    post: completionsHandler,
  },
]

enum ModelSources {
  'openai',
  'coreweave',
  'ai21',
  'forefront',
  'huggingface',
}
