import { Params } from '@feathersjs/feathers'
import unirest from 'unirest'
import cheerio from 'cheerio'
import serp from 'serp'

export interface GoogleSearchParams extends Params {
  query: any
}

export const queryGoogleSearch = async (searchTerm: string) => {
  async function searchDirectly() {
    const query = searchTerm.split(' ').join('+')
    const response = await unirest
      .get(`https://www.google.com/search?q=${query}&gl=us&hl=en`)
      .headers({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
      })
    const $ = cheerio.load(response.body)

    const el = $('.hgKElc')
    const featuredResult = $(el).text()

    if (featuredResult) return featuredResult

    const snippets = $('.g .VwiC3b ')

    return $(snippets[0]).text()
  }

  // promise.all serpSearch and searchDirectly
  const [serpSearch, searchDirectResponse] = await Promise.all([
    serp.search({
      host: 'google.com',
      qs: {
        q: searchTerm,
        filter: 0,
        pws: 0,
      },
      num: 10,
    }),
    searchDirectly(),
  ])

  // example serpSearch
  /*
  [{"url":"https://www.youtube.com/watch?v=mHONNcZbwDY","title":"Lionel Richie - Hello (Official Music Video) - YouTube"},{"url":"https://en.wikipedia.org/wiki/Hello#:~:text=Hello%20might%20be%20derived%20from,publications%20as%20early%20as%201803.","title":"Hello - Wikipedia"},{"url":"https://mollysmusic.org/blog/hard-songs-to-sing-hello-by-adele/#:~:text=The%20belt%20notes%20in%20%E2%80%9CHello,makes%20the%20belt%20more%20precarious.","title":"Hard Songs to Sing: Hello, by Adele - Molly's Music"}]
  */
  // for each item in serpSearch, format into a string, with the title and url
  const formattedSerpSearch = serpSearch.map(item => {
    return `${item.title} | URL: ${item.url}`
  })

  const output = `${searchDirectResponse}\n${formattedSerpSearch.join('\n')}`
  return {
    summary: searchDirectResponse,
    links: formattedSerpSearch,
  }
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GoogleSearchService<
  ServiceParams extends Params = GoogleSearchParams
> {
  async get(
    params: GoogleSearchParams
  ): Promise<{ summary: string; links: string }> {
    const query = params.query.query as string

    const data = await queryGoogleSearch(query)

    const { summary, links } = data
    return { summary, links }
  }
}
