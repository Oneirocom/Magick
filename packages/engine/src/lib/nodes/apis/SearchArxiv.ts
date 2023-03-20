// modified from https://www.npmjs.com/package/arxiv-api
import axios from 'axios'
import _ from 'lodash'
import util from 'util'
import { parseString } from 'xml2js'

const PREFIXES = {
  ALL: 'all',
  TI: 'ti', // Title
  AU: 'au', // Author
  ABS: 'abs', // Abstract
  CO: 'co', // Comment
  JR: 'jr', // Journal Reference
  CAT: 'cat', // Subject Category
  RN: 'rn', // Report Number
}

const SEPARATORS = {
  AND: '+AND+',
  OR: '+OR+',
  ANDNOT: '+ANDNOT+',
}

const SORT_BY = {
  RELEVANCE: 'relevance',
  LAST_UPDATED_DATE: 'lastUpdatedDate',
  SUBMITTED_DATE: 'submittedDate',
}

const SORT_ORDER = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
}

module.exports = {
  PREFIXES,
  SEPARATORS,
  SORT_BY,
  SORT_ORDER,
}

const parseStringPromisified = util.promisify(parseString)

const getArxivUrl = ({ searchQuery, sortBy, sortOrder, start, maxResults }) =>
  `http://export.arxiv.org/api/query?search_query=${searchQuery}&start=${start}&max_results=${maxResults}${sortBy ? `&sortBy=${sortBy}` : ''
  }${sortOrder ? `&sortOrder=${sortOrder}` : ''}`

/**
 * Parse arXiv entry object.
 * @param {Object} entry.
 * @returns {Object} formatted arXiv entry object.
 */
function parseArxivObject(entry: unknown) {
  return {
    id: _.get(entry, 'id[0]', ''),
    title: _.get(entry, 'title[0]', ''),
    summary: _.get(entry, 'summary[0]', '').trim(),
    authors: _.get(entry, 'author', []).map(
      (author: { name: string }) => author.name
    ),
    links: _.get(entry, 'link', []).map((link: { $: string }) => link.$),
    published: _.get(entry, 'published[0]', ''),
    updated: _.get(entry, 'updated[0]', ''),
    categories: _.get(entry, 'category', []).map(
      (category: { $: string }) => category.$
    ),
  }
}

/**
 * Parse a tag to a query string.
 * @param {{name: string, prefix: string}} tag
 * @param {string} name - the name of the tag - mandatory.
 * @param {string} prefix - one of PREFIXES - default to ALL.
 * @returns {string} query string of a tag.
 */
function parseTag({ name, prefix = PREFIXES.ALL }) {
  if (!_.isString(name) || _.isEmpty(name)) {
    return console.error('you must specify tag name')
  }
  if (!Object.values(PREFIXES).includes(prefix)) {
    return console.error(`unsupported prefix: ${prefix}`)
  }
  return `${prefix}:${name}`
}

/**
 * Parse include tags and exclude tags to a query string.
 * @param {Array.<{include: Array, exclude: Array}>} tags
 * @returns {string} query string between tags.
 */
function parseTags({ include, exclude = [] }) {
  if (!Array.isArray(include) || !Array.isArray(exclude)) {
    return console.error('include and exclude must be arrays')
  }
  if (include.length === 0) {
    return console.error('include is a mandatory field')
  }
  return `${include.map(parseTag).join(SEPARATORS.AND)}${exclude.length > 0 ? SEPARATORS.ANDNOT : ''
    }${exclude.map(parseTag).join(SEPARATORS.ANDNOT)}`
}

/**
 * Fetch data from arXiv API
 * @async
 * @param {{searchQueryParams: Array.<{include: Array, exclude: Array}>, start: number, maxResults: number}} args
 * @param {Array} searchQueryParams - array of search query.
 * @param {string} sortBy - can be "relevance", "lastUpdatedDate", "submittedDate".
 * @param {string} sortOrder - can be either "ascending" or "descending".
 * @param {number} start - the index of the first returned result.
 * @param {number} maxResults - the number of results returned by the query.
 * @returns {Promise}
 */
async function search({
  searchQueryParams,
  sortBy,
  sortOrder,
  start = 0,
  maxResults = 10,
}) {
  if (!Array.isArray(searchQueryParams)) {
    return console.error('query param must be an array')
  }
  if (sortBy && !Object.values(SORT_BY).includes(sortBy)) {
    return console.error(
      `unsupported sort by option. should be one of: ${Object.values(
        SORT_BY
      ).join(' ')}`
    )
  }
  if (sortOrder && !Object.values(SORT_ORDER).includes(sortOrder)) {
    return console.error(
      `unsupported sort order option. should be one of: ${Object.values(
        SORT_ORDER
      ).join(' ')}`
    )
  }
  const searchQuery = searchQueryParams.map(parseTags).join(SEPARATORS.OR)
  const response = await axios.get(
    getArxivUrl({ searchQuery, sortBy, sortOrder, start, maxResults })
  )
  const parsedData = await parseStringPromisified(response.data)
  return _.get(parsedData, 'feed.entry', []).map(parseArxivObject)
}

(async (includeQueries, excludeQueries) => {
  const papers = await search({
    searchQueryParams: [
      {
        include: (includeQueries as any).map((query: any) => {
          return { name: query }
        }),
        exclude: (excludeQueries as any).map((query: any) => {
          return { name: query }
        }),
      },
    ],
    start: 0,
    maxResults: 10,
  } as any)

  if (papers)
    for (const article in papers) {
      console.log(papers[article].title)
    }

  console.log(papers)
})()

export async function getArticle(id: any) {
  // ID is expected to be in [S2PaperId | DOI | ArXivId]
  const response = await fetch(`https://api.semanticscholar.org/v1/paper/${id}`)
  const data = await response.text()
  return JSON.parse(data)
}
