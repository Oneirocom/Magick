//@ts-ignore
import cors from '@koa/cors'
//@ts-ignore
import weaviate from 'weaviate-client'
import { config } from 'dotenv-flow'
import HttpStatus from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import Router from '@koa/router'
import axios from 'axios'
import { removePunctuation } from '@magickml/utils'
import { database } from '@magickml/database'
import keyword_extractor from 'keyword-extractor'
import * as fs from 'fs'
import https from 'https'
import {
  deleteDocument,
  search,
  singleTrain,
  updateDocument,
} from './weaviateClient'
import {
  ENABLE_SEARCH_CORPUS,
  HF_API_KEY,
  SEARCH_CORPUS_PORT,
  USESSL,
} from '@magickml/server-config'

config({ path: '.env' })
const searchEngine = 'davinci'
const client = weaviate.client({
  scheme: 'http',
  host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
})
const saved_docs: any[] = []

export async function initSearchCorpus(ignoreDotEnv: boolean) {
  if (ignoreDotEnv === false && ENABLE_SEARCH_CORPUS === 'false') {
    return
  }

  if (!database || database === undefined) {
    new database()
  }

  const app: Koa = new Koa()
  const router: Router = new Router()

  const options = {
    origin: '*',
  }
  app.use(cors(options))
  app.use(koaBody({ multipart: true }))

  router.get('/document-store', async function (ctx: Koa.Context) {
    const stores = await database.getDocumentStores()
    return (ctx.body = stores.sort((a, b) => a.id - b.id))
  })
  router.get('/document', async function (ctx: Koa.Context) {
    const storeId = ctx.query.storeId as unknown as number
    if (!storeId || storeId === undefined) {
      ctx.response.status = 400
      return (ctx.body = [])
    }

    const documents: any = await database.getDocumentsOfStore(storeId)
    return (ctx.body = documents)
  })
  router.get('/document/:docId', async function (ctx: Koa.Context) {
    const docId = ctx.params.docId
    if (!docId || docId === undefined) {
      ctx.response.status = 400
      return (ctx.body = {})
    }
    const doc = await database.getSingleDocument(docId)
    return (ctx.body = doc)
  })
  router.post('/document', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const title = body?.title || ''
    const description = body?.description || ''
    const isIncluded = body?.isIncluded && true
    const storeId = body?.storeId

    if (!storeId || storeId === undefined) {
      ctx.response.status = 400
      return (ctx.body = {
        error: 'You need to create a Document Store first',
      })
    }

    let id = -1
    try {
      id = await database.addDocument(title, description, isIncluded, storeId)
      await singleTrain({
        title: title ?? 'Document',
        description: description,
      })
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    if (id === -1) {
      return (ctx.body = 'internal error')
    }

    return (ctx.body = { documentId: id })
  })
  router.post('/document_mass', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    let storeId = body?.storeId
    const documents = body?.documents
    const store_name = body?.store_name

    if (!storeId || storeId === undefined) {
      storeId = await database.getSingleDocumentStore(
        store_name && store_name?.length > 0 ? store_name : 'rss_feed'
      )
      console.log('generated store id:', storeId)
      if (storeId?.length <= 0 || storeId === undefined || !storeId) {
        storeId = await database.addDocumentStore(
          store_name && store_name?.length > 0 ? store_name : 'rss_feed'
        )
      } else {
        if (storeId[0] && storeId[0] !== undefined) {
          storeId = storeId[0].id
        } else {
          storeId = await database.addDocumentStore(
            store_name && store_name?.length > 0 ? store_name : 'rss_feed'
          )
        }
      }
    }

    let id = -1
    try {
      for (let i = 0; i < documents.length; i++) {
        console.log('saving document:', documents[i])
        if (
          saved_docs.includes({
            title: documents[i].title,
            description: documents[i].description,
          })
        ) {
          continue
        }

        id = await database.addDocument(
          documents[i].title,
          documents[i].description,
          true,
          storeId
        )
        saved_docs.push({
          title: documents[i].title,
          description: documents[i].description,
        })
        await singleTrain({
          title: documents[i].title ?? 'Document',
          description: documents[i].description,
        })
      }
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    if (id === -1) {
      return (ctx.body = 'internal error')
    }

    return (ctx.body = { documentId: id })
  })
  router.delete('/document', async function (ctx: Koa.Context) {
    const documentId = ctx.query.documentId as unknown as number
    const doc = await database.getSingleDocument(documentId)

    try {
      await database.removeDocument(documentId)
      if (doc) {
        await deleteDocument(doc.title ?? 'Document', doc.description)
      }
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.post('/update_document', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const documentId = body?.documentId
    const title = body?.title || ''
    const description = body?.description || ''
    const isIncluded = body?.isIncluded && true
    const storeId = body?.storeId
    const doc = await database.getSingleDocument(documentId)

    if (!storeId || storeId === undefined) {
      ctx.response.status = 400
      return (ctx.body = {
        error: 'You need to create a Document Store first',
      })
    }

    try {
      await database.updateDocument(
        documentId,
        title,
        description,
        isIncluded,
        storeId
      )
      if (doc) {
        await updateDocument(
          doc.title ?? 'Document',
          title ?? 'Document',
          doc.description,
          description
        )
      }
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.get('/search', async function (ctx: Koa.Context) {
    const question = ctx.request.query?.question as string

    const searchResult = await search(question)
    return (ctx.body = searchResult)
  })

  router.post('/content-object', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const title = body?.title || ''
    const description = body?.description || ''
    const isIncluded = body?.isIncluded && true
    const documentId = body?.documentId

    let id = -1
    try {
      id = await database.addContentObj(
        title,
        description,
        isIncluded,
        documentId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    if (id === -1) {
      return (ctx.body = 'internal error')
    }

    return (ctx.body = { contentObjId: id })
  })
  router.put('/content-object', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const objId = body.objId
    const title = body?.title || ''
    const description = body?.description || ''
    const isIncluded = body?.isIncluded && true
    const documentId = body?.documentId

    try {
      await database.editContentObj(
        objId,
        title,
        description,
        isIncluded,
        documentId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.get('/content-object', async function (ctx: Koa.Context) {
    const documentId = ctx.query.documentId as unknown as number
    const contentObjects: any = await database.getContentObjOfDocument(
      documentId
    )

    return (ctx.body = contentObjects)
  })
  router.delete('/content-object', async function (ctx: Koa.Context) {
    const objId = ctx.query.objId as unknown as number
    try {
      await database.removeContentObject(objId)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })

  router.get('/document-store', async function (ctx: Koa.Context) {
    const stores = await database.getDocumentStores()
    return (ctx.body = stores)
  })
  router.get('/document-store/:name', async function (ctx: Koa.Context) {
    const name = ctx.params.name
    const store = await database.getSingleDocumentStore(name)
    return (ctx.body = store)
  })
  router.post('/document-store', async function (ctx: Koa.Context) {
    const name = ctx.request.body?.name || ''
    let id = -1
    try {
      id = await database.addDocumentStore(name)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    if (id === -1) return (ctx.body = 'internal error')
    return (ctx.body = { documentStoreId: id })
  })
  router.put('/document-store', async function (ctx: Koa.Context) {
    const storeId = ctx.request.body?.id
    const name = ctx.request.body?.name || ''
    try {
      await database.updateDocumentStore(storeId, name)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })
  router.delete('/document-store', async function (ctx: Koa.Context) {
    const storeId = ctx.query.storeId as unknown as number
    try {
      const documents = await database.getDocumentsOfStore(storeId)
      if (documents && documents.length > 0) {
        for (let i = 0; i < documents.length; i++) {
          await deleteDocument(
            documents[i].title ?? 'Document',
            documents[i].description
          )
        }
      }

      await database.removeDocumentStore(storeId)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error) {
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
      error.status = ctx.status
      ctx.body = { error }
      ctx.app.emit('error', error, ctx)
    }
  })

  const PORT: number = Number(SEARCH_CORPUS_PORT) || 65531
  const useSSL =
    USESSL === 'true' &&
    fs.existsSync('certs/') &&
    fs.existsSync('certs/key.pem') &&
    fs.existsSync('certs/cert.pem')

  let sslOptions = {
    rejectUnauthorized: false,
    key: useSSL ? fs.readFileSync('certs/key.pem') : '',
    cert: useSSL ? fs.readFileSync('certs/cert.pem') : '',
  }

  useSSL
    ? https
        .createServer(sslOptions, app.callback())
        .listen(PORT, 'localhost', () => {
          console.log('Corpus Search Server listening on: localhost:' + PORT)
        })
    : https
        .createServer({ rejectUnauthorized: false }, app.callback())
        .listen(PORT, 'localhost', () => {
          console.log('Corpus Search Server listening on: localhost:' + PORT)
        })
}

export async function extractKeywords(input: string): Promise<string[]> {
  const keywords: string[] = []

  const res = keyword_extractor.extract(input, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })

  if (res.length == 0) {
    return []
  }

  const result: any = await MakeModelRequest(input, 'flair/pos-english')

  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (result[j].word === res[i]) {
        if (
          result[j].entity_group === 'NN' ||
          result[j].entity_group === 'NNS'
        ) {
          keywords.push(res[i])
          break
        }
      }
    }
  }
  if (keywords.length === 0) {
    return []
  }

  let totalLength = 0
  const respp: string[] = []
  for (let i = 0; i < keywords.length; i++) {
    const weaviateResponse: any = await makeWeaviateRequest(keywords[i])

    if (weaviateResponse.Paragraph.length > 0) {
      const sum: any = await MakeModelRequest(
        weaviateResponse.Paragraph[0].content,
        'facebook/bart-large-cnn'
      )
      if (sum && sum.length > 0) {
        totalLength += sum[0].summary_text.length
        if (totalLength > 1000) {
          return keywords
        }
        respp.push(keywords[i])
      }
    }
  }
  return respp
}

export async function MakeModelRequest(
  inputs: any,
  model: string,
  parameters = {},
  options = { use_cache: false, wait_for_model: true }
) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs, parameters, options },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    )
    return await response.data
  } catch (err) {
    console.error(err)
    return { success: false }
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
