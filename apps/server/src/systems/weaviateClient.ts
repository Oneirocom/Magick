//@ts-nocheck
import { SearchSchema } from 'src/types'
import weaviate from 'weaviate-client'
import * as fs from 'fs'
import { classifyText } from '../../../core/src/utils/textClassifier'
import path from 'path'
import { database } from '../database'
import axios from 'axios'
import { ClassifierSchema } from '../types'

const DOCUMENTS_CLASS_NAME = 'DataStore'
const saved_docs: SearchSchema[] = []
let client: weaviate.client

export async function initWeaviateClient(
  _train: boolean,
  _trainClassifier: boolean
) {
  client = weaviate.client({
    scheme: process.env.WEAVIATE_CLIENT_SCHEME,
    host: process.env.WEAVIATE_CLIENT_HOST,
  })

  if (_train) {
    console.time('train')

    const data = await trainFromUrl(
      'https://www.toptal.com/developers/feed2json/convert?url=https%3A%2F%2Ffeeds.simplecast.com%2F54nAGcIl'
    )
    const data2 = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '/weaviate/test_data.json'),
        'utf-8'
      )
    )
    for (let i = 0; i < data2.length; i++) {
      data.push(data2[i])
    }

    await train(data)
    console.timeEnd('train')
  }

  if (_trainClassifier) {
    await trainClassifier(
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '..', '..', '/weaviate/classifier_data.json'),
          'utf-8'
        )
      )
    )
  }
}

async function trainClassifier(data: ClassifierSchema[]) {
  if (!client) {
    initWeaviateClient(false)
  }

  if (!data || data === undefined) {
    return
  }

  for (let i = 0; i < data.length; i++) {
    if (Array.isArray(data[i].examples)) {
      data[i].examples = (data[i].examples as string[]).join(', ')
    }

    console.log(typeof data[i].examples, data[i].examples)

    const res = await client.data
      .creator()
      .withClassName('Emotion')
      .withProperties(data[i])
      .do()

    console.log(res)
  }
}

async function train(data: SearchSchema[]) {
  if (!client) {
    initWeaviateClient(false)
  }

  if (!data || data === undefined) {
    return
  }

  for (let i = 0; i < data.length; i++) {
    const object: SearchSchema = {
      title: data[i].title,
      description: data[i].description,
    }
    if (saved_docs.includes(object)) {
      continue
    }

    saved_docs.push(object)
    const res = await client.data
      .creator()
      .withClassName(DOCUMENTS_CLASS_NAME)
      .withProperties(object)
      .do()

    console.log(res)
  }

  const documents = await database.instance.getAllDocuments()
  if (documents && documents.length > 0) {
    for (let i = 0; i < documents.length; i++) {
      const object = {
        title: 'Document',
        description: documents[i].description,
      }
      if (saved_docs.includes(object)) {
        continue
      }

      saved_docs.push(object)
      const res = await client.data
        .creator()
        .withClassName(DOCUMENTS_CLASS_NAME)
        .withProperties(object)
        .do()
      console.log(res)
    }
  }

  console.log('trained client')
}

async function trainFromUrl(url: string): Promise<SearchSchema[]> {
  if (!url || url.length <= 0) {
    return []
  }

  const res = await axios.get(url)
  const data = res.data
  if (!data || data === undefined) {
    return []
  }

  const items = data.items
  if (!items || items === undefined) {
    return []
  }

  const _data: SearchSchema[] = []
  for (let i = 0; i < items.length; i++) {
    const object: SearchSchema = {
      title: items[i].title,
      description: items[i].content_html
        .replace('<br>', '\\n')
        .replace('</p>', '\\n')
        .replace(/<[^>]*>?/gm, ''),
    }
    _data.push(object)
  }

  return _data
}

export async function singleTrain(data: SearchSchema) {
  if (!client) {
    initWeaviateClient(false)
  }

  if (!data || data === undefined) {
    return
  }

  const object: SearchSchema = {
    title: data.title,
    description: data.description,
  }
  if (saved_docs.includes(object)) {
    return
  }

  saved_docs.push(object)
  const res = await client.data
    .creator()
    .withClassName(DOCUMENTS_CLASS_NAME)
    .withProperties(object)
    .do()

  console.log(res)
}

export async function search(query: string): SearchSchema {
  if (!client || client === undefined) {
    await initWeaviateClient(false, false)
  }

  const info = await client.graphql
    .get()
    .withClassName(DOCUMENTS_CLASS_NAME)
    .withFields('title description')
    .withNearText({
      concepts: [query],
      certainty: 0.6,
    })
    .do()

  if (info.errors) {
    console.log(info.errors)
    return { title: '', description: '' }
  }

  if (
    info['data'] &&
    info['data']['Get'] &&
    info['data']['Get'][DOCUMENTS_CLASS_NAME] &&
    info['data']['Get'][DOCUMENTS_CLASS_NAME].length > 0
  ) {
    const data = info['data']['Get'][DOCUMENTS_CLASS_NAME][0]

    return {
      title: data.title,
      description: data.description,
    }
  } else {
    return { title: '', description: '' }
  }
}
export async function classify(query: string): Promise<string> {
  if (!client || client === undefined) {
    return ''
  }

  const info = await client.graphql
    .get()
    .withClassName('Emotion')
    .withFields(['type', 'examples'])
    .withNearText({
      concepts: [query],
      certainty: 0.7,
    })
    .do()

  if (info.errors) {
    console.log(info.errors)
    return ''
  }

  if (
    info['data'] &&
    info['data']['Get'] &&
    info['data']['Get']['Emotion'] &&
    info['data']['Get']['Emotion'].length > 0
  ) {
    const data = info['data']['Get']['Emotion'][0]

    return data.type
  } else {
    return ''
  }
}

async function getDocumentId(
  title: string,
  description: string
): Promise<string> {
  if (!client) {
    await initWeaviateClient(false)
  }

  const docs = await client.data.getter().do()
  for (let i = 0; i < docs.objects.length; i++) {
    if (
      docs.objects[i].properties.title == title &&
      docs.objects[i].properties.description == description
    ) {
      return docs.objects[i].id
    }
  }

  return ''
}

export async function updateDocument(
  oldTitle: string,
  newTitle: string,
  oldDescription: string,
  newDescription: string
) {
  if (!client) {
    await initWeaviateClient(false)
  }

  if (
    !oldTitle ||
    oldTitle.length <= 0 ||
    !newTitle ||
    newTitle.length <= 0 ||
    !oldDescription ||
    oldDescription.length <= 0 ||
    !newDescription ||
    newDescription.length <= 0
  ) {
    return
  }

  if (oldTitle === newTitle && oldDescription === newDescription) {
    return
  }

  const id = await getDocumentId(oldTitle, oldDescription)
  if (id && id.length > 0) {
    client.data
      .getterById()
      .withId(id)
      .do()
      .then(res => {
        console.log('RES:', res)
        const _class = res.class
        const schema = res.properties
        schema.title = newTitle
        schema.description = newDescription

        return client.data
          .updater()
          .withId(id)
          .withClassName(_class)
          .withProperties(schema)
          .do()
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
export async function deleteDocument(title: string, description: string) {
  if (!client) {
    await initWeaviateClient(false)
  }

  if (!title || title.length <= 0 || !description || description.length <= 0) {
    return
  }

  const id = await getDocumentId(title, description)
  if (id && id.length > 0) {
    client.data
      .deleter()
      .withId(id)
      .do()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }
}