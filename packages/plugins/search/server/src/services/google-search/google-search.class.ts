// DOCUMENTED 
import { Params } from '@feathersjs/feathers';
import unirest from 'unirest';
import cheerio from 'cheerio';
import serp from 'serp';

/**
 * Interface for Google Search parameters.
 */
export interface GoogleSearchParams extends Params {
  query: any;
}

/**
 * Queries Google Search directly and returns the featured result or snippets.
 *
 * @param searchTerm - The search term to query.
 * @returns A Promise that resolves to the search result string.
 */
async function searchDirectly(searchTerm: string): Promise<string> {
  console.log('searching directly');
  const query = searchTerm.split(' ').join('+');
  const response = await unirest
    .get(`https://www.google.com/search?q=${query}&gl=us&hl=en`)
    .headers({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
    });
  const $ = cheerio.load(response.body);

  const el = $('.hgKElc');
  const featuredResult = $(el).text();

  if (featuredResult) return featuredResult;

  const snippets = $('.g .VwiC3b');
  let text = '';
  snippets.each((i, el) => {
    text += $(el).text();
  });

  return text;
}

/**
 * Queries Google Search and returns structured results.
 *
 * @param searchTerm - The search term to query.
 * @returns An object with a summary and links.
 */
export const queryGoogleSearch = async (searchTerm: string) => {
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
    searchDirectly(searchTerm),
  ]);

  const formattedSerpSearch = serpSearch?.map(item => {
    return `${item.title} | URL: ${item.url}`;
  }) ?? [];

  const output = `${searchDirectResponse}\n${formattedSerpSearch.join('\n')}`;

  console.log('output', output);

  return {
    summary: searchDirectResponse,
    links: formattedSerpSearch,
  };
};

/**
 * Google Search service for Feathers.
 */
export class GoogleSearchService {
  /**
   * Returns a Google Search result summary and links.
   *
   * @param params - Google Search parameters.
   * @returns An object with a summary and links.
   */
  async find(
    params: GoogleSearchParams
  ): Promise<{ summary: string; links: string[] }> {
    console.log('params', params);
    const query = params.query.query as string;
    console.log('query', query);

    const data = await queryGoogleSearch(query);

    const { summary, links } = data;
    return { summary, links };
  }
}