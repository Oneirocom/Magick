/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import 'regenerator-runtime/runtime'
import glob from 'glob'
import weaviate from 'weaviate-client'
import wiki from 'wikipedia'

import { database } from '@magickml/database'

const client = weaviate.client({
  scheme: 'http',
  host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
})

export const searchWikipedia = async keyword => {
  // if keywords contains more than three words, summarize with GPT-3
  if (keyword.trim().split(' ').length > 3) {
    // Search for it, and accept suggestion if there is one
    const searchResults = await wiki.search(keyword)

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

    let filePath = null

    glob(keyword + '.*', (err, files) => {
      if (err) {
        console.error(err)
      } else {
        // a list of paths to javaScript files in the current working directory
        console.log(files)
        filePath = files[0]
      }
    })

    if (
      searchResults.results[0]?.title?.trim().toLowerCase() ===
      keyword.trim().toLowerCase()
    ) {
      const result = await lookUpOnWikipedia(keyword)
      return {
        result,
        filePath,
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
        filePath,
      }
    } else
      return {
        result: keyword,
        filePath: '',
      }
  }
}

export const makeWeaviateRequest = async keyword => {
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

export async function lookUpOnWikipedia(subject) {
  try {
    if (await database.instance.wikipediaDataExists(subject)) {
      return JSON.parse(await database.instance.getWikipediaData(subject))
    } else {
      console.log("Data doesn't yet exist")
    }

    // if it doesn't, fetch it from wikipedia and save it to the file
    const { title, displaytitle, description, extract } = await wiki.summary(
      subject
    )

    const summary = {
      title,
      displaytitle,
      description,
      extract,
    }

    // create a directory recursively at data/wikipedia/ if it doesn't exist
    await database.instance.addWikipediaData(subject, JSON.stringify(summary))

    return summary
  } catch (err) {
    console.error(err)
  }
}
