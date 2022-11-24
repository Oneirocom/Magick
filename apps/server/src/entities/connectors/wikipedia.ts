/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import glob from 'glob'
import weaviate from 'weaviate-client'
import wiki from 'wikipedia'

import { MakeCompletionRequest } from '../../utils/MakeCompletionRequest'
import { database } from '../../database'

const client = weaviate.client({
  scheme: 'http',
  host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
})

//Creates a new agent based on its Wikipedia article
export async function createWikipediaEntity(speaker, name, personality, facts) {
  if (!database.instance) {
    new database()
  }

  try {
    let start = Date.now()
    //gets the info from the wikipedia article, if the agent name can't be found it returns null, in order to send the default agent
    let out = null
    try {
      out = await searchWikipedia(name)
    } catch (e) {
      console.error(e)
      return null
    }

    let stop = Date.now()
    console.log(
      `Time Taken to execute loaded data from wikipedia = ${(stop - start) / 1000
      } seconds`
    )
    start = Date.now()

    //const type = await namedEntityRecognition(out.result.title);

    // create a constant called name which uses the value of nameRaw but removes all punctuation
    // const name = nameRaw.replace(/[^\w\s]/gi, '');
    console.log('out is ', out)
    if (out.result.extract == '' || out.result.extract == null) {
      return console.log(
        "Error, couldn't find anything on wikiedia about " + name
      )
    }

    const factSourcePrompt = `The following are facts about ${name}\n`
    const factPrompt = factSourcePrompt + out.result.extract + '\n' + facts

    const personalitySourcePrompt = `Based on the above facts, the following is a description of the personality of an anthropomorphized ${name}:`

    stop = Date.now()
    console.log(
      `Time Taken to execute save data = ${(stop - start) / 1000} seconds`
    )
    start = Date.now()

    let data = {
      prompt: factPrompt + '\n' + personalitySourcePrompt,
      temperature: 0.9,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""', `${speaker}:`, '\n'],
    }

    let res = await MakeCompletionRequest(
      data,
      speaker,
      name,
      'personality_generation',
      'davinci',
      false
    )

    stop = Date.now()
    console.log(
      `Time Taken to execute openai request = ${(stop - start) / 1000} seconds`
    )
    start = Date.now()

    if (!res.success) {
      console.log('Error: Failed to generate personality, check GPT3 keys')
      return undefined
    }

    const dialogPrompt = `The following is a conversation with ${name}. ${name} is helpful, knowledgeable and very friendly\n${speaker}: Hi there, ${name}! Can you tell me a little bit about yourself?\n${name}:`

    data = {
      prompt:
        factPrompt +
        '\n' +
        personalitySourcePrompt +
        '\n' +
        res +
        '\n' +
        dialogPrompt,
      temperature: 0.9,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""', `${speaker}:`, '\n'],
    }

    res = MakeCompletionRequest(
      data,
      speaker,
      name,
      'dialog_generation',
      'davinci',
      false
    )

    stop = Date.now()
    console.log(
      `Time Taken to execute openai request 2 = ${(stop - start) / 1000
      } seconds`
    )
    start = Date.now()
    console.log('res.choice.text (2)')
    console.log(res)

    stop = Date.now()
    console.log(
      `Time Taken to execute save data = ${(stop - start) / 1000} seconds`
    )
    start = Date.now()
    return out
  } catch (err) {
    console.error(err)
  }
  return {}
}

export const searchWikipedia = async keyword => {
  console.log('SEARCH WIKIPEDIA, KEYWORD:', keyword)
  // if keywords contains more than three words, summarize with GPT-3
  if (keyword && keyword !== undefined && keyword?.length > 0 && keyword?.trim()?.split(' ').length > 3) {
    const data = {
      prompt: keyword + '\n\nKeywords:',
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0,
      stop: ['\n'],
    }

    const { success, choice } = await MakeCompletionRequest(
      data,
      null,
      null,
      'conversation'
    )
    if (success) {
      keyword = choice.text
    }
  }

  // Search for it, and accept suggestion if there is one
  const searchResults = await wiki.search(keyword)

  // If the first result contains the keyword or vice versa, probably just go with it
  if (
    searchResults.results[0] &&
    (searchResults.results[0].title
      .toLowerCase()
      .includes(keyword?.toLowerCase()) ||
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
