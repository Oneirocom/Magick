import { OPENAI_API_KEY } from '@magickml/engine'
import weaviate from 'weaviate-client'
import wiki from 'wikipedia'

import axios from 'axios'

async function MakeCompletionRequest(
  data: any,
  engine: any,
  apiKey: string
) {
  return await makeOpenAIGPT3Request(data, engine, apiKey)
}
const useDebug = false
async function makeOpenAIGPT3Request(
  data: any,
  engine: any,
  apiKey: string
) {
  if (useDebug) return { success: true, choice: { text: 'Default response' } }
  const API_KEY = (apiKey !== '' && apiKey) ?? OPENAI_API_KEY
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  }
  try {
    const gptEngine = engine ?? 'davinci'
    const resp = await axios.post(
      `https://api.openai.com/v1/engines/${gptEngine}/completions`,
      data,
      { headers: headers }
    )

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return { success: true, choice }
    }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}

const client = weaviate.client({
  scheme: 'http',
  host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
})

export const searchWikipedia = async (keyword: string) => {
  // if keywords contains more than three words, summarize with GPT-3
  if (keyword.trim().split(' ').length > 3) {
    const data = {
      prompt: keyword + '\n\nKeywords:',
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0,
      stop: ['\n'],
    }

    const { success, choice } = (await MakeCompletionRequest(
      data,
      'davinci',
      OPENAI_API_KEY
    )) as any

    if (success) {
      keyword = choice.text
    }
  }

  // Search for it, and accept suggestion if there is one
  const searchResults = (await wiki.search(keyword)) as any

  // If the first result contains the keyword or vice versa, probably just go with it
  if (
    searchResults.results[0] &&
    (searchResults.results[0].title
      .toLowerCase()
      .includes(keyword.toLowerCase()) ||
      keyword
        .toLowerCase()
        .includes(searchResults.results[0].title.toLowerCase()))
  ) {
    keyword = searchResults.results[0].title
  } else if (searchResults.suggestion) {
    keyword = searchResults.suggestion
  } else if (searchResults[0] != undefined) {
    keyword = searchResults[0].title
  }

  // TODO: If certainty is below .92...
  // Fuzzy match and sort titles

  if (
    searchResults.results[0]?.title?.trim().toLowerCase() ===
    keyword.trim().toLowerCase()
  ) {
    const result = await lookUpOnWikipedia(keyword)
    return {
      result,
    }
  }

  // if it's not immediately located, request from weaviate
  const weaviateResponse = await makeWeaviateRequest(keyword)

  if (weaviateResponse?.Paragraph[0]?.inArticle[0]?.title) {
    const result = await lookUpOnWikipedia(
      weaviateResponse?.Paragraph[0]?.inArticle[0]?.title
    )

    return {
      result,
    }
  } else
    return {
      result: keyword,
      filePath: '',
    }
}

export const makeWeaviateRequest = async (keyword: string) => {
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

  if (res.data.Get !== undefined) {
    return res.data.Get
  }
  return
}

export async function lookUpOnWikipedia(subject: string) {
  try {
    const { title, displaytitle, description, extract } = await wiki.summary(
      subject
    )

    const summary = {
      title,
      displaytitle,
      description,
      extract,
    }

    return summary
  } catch (err) {
    console.error(err)
  }
}
