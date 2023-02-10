import Koa from 'koa';

import { Route, ServerError } from '@magickml/server-core'
import { lookUpOnWikipedia } from "./helpers";
import weaviate from 'weaviate-client'

const getWikipediaSummary = async (ctx: Koa.Context) => {
  const { keyword } = ctx.query

  if (!keyword) throw new ServerError('input-failed', 'No keyword supplied in params')

  //gets the info from the wikipedia article, if the agent name can't be found it returns null, in order to send the default agent
  let out = null
  try {
    out = await lookUpOnWikipedia(keyword as string) as any
  } catch (e) {
    console.error(e)
    throw new ServerError('server-error', 'Error in getting wikipedia summary')
  }

  console.log('out is', out)

  //const type = await namedEntityRecognition(out.title);

  // create a constant called name which uses the value of nameRaw but removes all punctuation
  // const name = nameRaw.replace(/[^\w\s]/gi, '');

  if (out.extract == '' || out.extract == null) {
    return console.log(
      "Error, couldn't find anything on wikiedia about " + keyword
    )
  }

  ctx.body = {
    result: out
  }
}

const handleWeaviateRequest = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as any
  const keyword = body.keyword as string

  const client = weaviate.client({
    scheme: 'http',
    host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
  })

  const res = await client.graphql
    .get()
    .withNearText({
      concepts: [keyword],
      certainty: 0.75,
    })
    .withClassName('Paragraph')
    .withFields('title content inArticle { ... on Article {  title } }')
    .withLimit(3)
    .do()

  console.log('RESPONSE', res)

  if (res?.data?.Get !== undefined) {
    return (ctx.body = { data: res.data.Get })
  }
  return (ctx.body = { data: '' })
}

export const wikipedia: Route[] = [
  {
    path: '/wikipediaSummary',
    get: getWikipediaSummary
  },
  {
    path: '/weaviate',
    post: handleWeaviateRequest,
  },
]