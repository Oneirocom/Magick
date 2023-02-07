import Koa from 'koa';

import { Route } from "../types";
import { ServerError } from "../utils/ServerError";
import { lookUpOnWikipedia } from "./helpers";

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

export const wikipedia: Route[] = [
  {
    path: '/wikipediaSummary',
    get: getWikipediaSummary
  }
]