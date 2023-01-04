import { CreateEventArgs, GetEventArgs } from '@ magickml/core'
import pg from 'pg'
import { Sequelize } from 'sequelize'
import { initModels } from '../models/init-models'

const creatorToolsUrl =
  !!process.env.CREATOR_TOOLS_DB_URL &&
  process.env.CREATOR_TOOLS_DB_URL != '' &&
  process.env.CREATOR_TOOLS_DB_URL
const connectionString =
  creatorToolsUrl ||
  'postgres://' +
    process.env.PGUSER +
    ':' +
    process.env.PGPASSWORD +
    '@' +
    process.env.PGHOST +
    ':' +
    process.env.PGPORT +
    '/' +
    process.env.PGDATABASE
const sequelize = new Sequelize(creatorToolsUrl || connectionString, {
  dialect: 'postgres',
  dialectOptions: creatorToolsUrl ? { ssl: { rejectUnauthorized: false } } : {},
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
  logging:
    process.env.LOG_SQL === 'true'
      ? (sql, time) =>
          // eslint-disable-next-line no-console
          console.log({
            msg: 'SQL execution info',
            context: { time, sql },
          })
      : false,
})

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const { Client } = pg

const PGSSL = process.env.PGSSL === 'true'
export class database {
  static instance: database

  pool: any
  client: pg.Client
  models
  sequelize: Sequelize
  constructor() {
    database.instance = this
    this.sequelize = sequelize
    this.models = { ...initModels(sequelize) }
  }

  async connect() {
    this.client = new Client({
      user: process.env.PGUSER as any,
      password: process.env.PGPASSWORD as any,
      database: process.env.PGDATABASE as any,
      port: process.env.PGPORT as any,
      host: process.env.PGHOST,
      ssl: PGSSL
        ? {
            rejectUnauthorized: false,
          }
        : false,
    })
    this.client.connect()
  }

  // create a type called CreateEventArgs in typescript

  async createEvent({
    type,
    agent,
    speaker,
    sender,
    client,
    channel,
    text,
  }: CreateEventArgs) {
    const query =
      'INSERT INTO events(type, agent, speaker, sender, client, channel, text, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
    const values = [
      type,
      agent,
      speaker,
      sender,
      client,
      channel,
      text,
      new Date().toUTCString(),
    ]

    await this.client.query(query, values)
  }
  async getEvents({
    type,
    agent,
    speaker,
    client = null,
    channel,
    maxCount = 10,
    max_time_diff = -1,
  }: GetEventArgs) {
    // this is the query that we will return
    let query = ''

    // this is the values that we will return
    const values = []

    // if the type is not empty, then we want to add it to the query
    if (type) {
      query += 'type = $1'
      values.push(type)
    }

    // if the agent is not empty, then we want to add it to the query
    if (agent) {
      // if the query is not empty, then we want to add an AND to the query
      if (query) {
        query += ' AND '
      }

      query += 'agent = $2'
      values.push(agent)
    }

    // if the client is not empty, then we want to add it to the query
    if (client) {
      // if the query is not empty, then we want to add an AND to the query
      if (query) {
        query += ' AND '
      }

      query += 'client = $3'
      values.push(client)
    }

    // if the speaker is not empty, then we want to add it to the query
    if (speaker) {
      // if the query is not empty, then we want to add an AND to the query
      if (query) {
        query += ' AND '
      }

      query += 'speaker = $4'
      values.push(speaker)
    }

    if (channel) {
      // if the query is not empty, then we want to add an AND to the query
      if (query) {
        query += ' AND '
      }

      query += 'channel = $5'
      values.push(channel)
    }

    // then you can just use the query and values in the query
    const row = await this.client.query(
      `SELECT * FROM events WHERE ${query} ORDER BY date DESC LIMIT ${maxCount}`,
      values
    )

    // if no values are returned, return an empty array
    if (!row || !row.rows || row.rows.length <= 0) return ''

    const now = new Date()
    const max_length = maxCount
    let data = ''
    let count = 0
    for (let i = 0; i < row.rows.length; i++) {
      if (!row.rows[i].text || row.rows[i].text.length <= 0) continue
      if (max_time_diff > 0) {
        const messageDate = new Date(row.rows[i].date)
        const diffMs = now.getTime() - messageDate.getTime()
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
        if (diffMins > 15) {
          break
        }
      }

      // TODO: this is horrible hardcode, we should rewrite this to be more generic and not have to hardcode the types
      data +=
        (type === 'conversation' || 'history'
          ? row.rows[i].sender + ': '
          : '') +
        row.rows[i].text +
        '\n'
      count++
      if (count >= max_length) {
        break
      }
    }

    return data.split('\n').reverse().join('\n')
  }
  async getAllEvents() {
    const query = 'SELECT * FROM events'
    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async getSortedEventsByDate(sortOrder: string) {
    const query = 'SELECT * FROM events'
    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      rows.rows.sort(
        (
          a: { date: string | number | Date },
          b: { date: string | number | Date }
        ) => {
          if (sortOrder === 'asc')
            return new Date(a.date).valueOf() - new Date(b.date).valueOf()
          else {
            let sortValue =
              new Date(b.date).valueOf() - new Date(a.date).valueOf()
            return sortValue === 0 ? -1 : sortValue
          }
        }
      )
      return rows.rows
    } else return []
  }
  async deleteEvent(id: number) {
    const query = 'DELETE FROM events WHERE id = $1'
    const values = [id]
    return await this.client.query(query, values)
  }
  async updateEvent(id: number, data: { [key: string]: string }) {
    const findEventQuery = 'SELECT * FROM events WHERE id = $1'
    const findEventQueryValues = [id]
    const rows = await this.client.query(findEventQuery, findEventQueryValues)
    if (rows && rows.rows && rows.rows.length > 0) {
      const { agent, sender, client, channel, text, type, date } = data
      const query = `UPDATE events SET agent = $1, sender = $2, client = $3, channel = $4, text = $5, type = $6, date = $7 WHERE id = $8`
      const values = [agent, sender, client, channel, text, type, date, id]
      const res = await this.client.query(query, values)
      return res.rowCount
    } else return 0
  }

  async addWikipediaData(agent: any, data: any) {
    const query =
      'INSERT INTO events(type, agent, client, channel, sender, text, date) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values = [
      'agent_data',
      agent,
      'wikipedia',
      'wikipedia',
      'wikipedia',
      data,
      new Date().toUTCString(),
    ]

    await this.client.query(query, values)
  }
  async getWikipediaData(agent: any) {
    const query =
      'SELECT * FROM events WHERE type=$1 AND agent=$2 AND client=$3 AND channel=$4 AND sender=$5'
    const values = ['agent_data', agent, 'wikipedia', 'wikipedia', 'wikipedia']

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].text
    } else {
      return ''
    }
  }
  async wikipediaDataExists(agent: any) {
    const query =
      'SELECT * FROM events WHERE type=$1 AND agent=$2 AND client=$3 AND channel=$4 AND sender=$5'
    const values = ['agent_data', agent, 'wikipedia', 'wikipedia', 'wikipedia']

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async getEntities() {
    const query = 'SELECT * FROM entities'
    const rows = await this.client.query(query)
    return rows.rows
  }
  async getEntity(id: any) {
    const query = 'SELECT * FROM entities WHERE id=$1'
    const values = [id]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]
    } else {
      return undefined
    }
  }
  async entityExists(id: any) {
    const query = 'SELECT * FROM entities WHERE id=$1'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async deleteEntity(id: any) {
    const query = 'DELETE FROM entities WHERE id=$1'
    const values = [id]
    return await this.client.query(query, values)
  }
  async getLastUpdatedInstances() {
    const query = 'SELECT * FROM entities'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const res = []
      for (let i = 0; i < rows.rows.length; i++) {
        res.push({
          id: rows.rows[i].id,
          lastUpdated: rows.rows[i].updated_at ? rows.rows[i].updated_at : 0,
        })
      }
      return res
    } else {
      return []
    }
  }
  async setEntityDirty(id: any, value: boolean) {
    const query = 'UPDATE entities SET dirty=$1 WHERE id=$2'
    const values = [value, id]

    await this.client.query(query, values)
  }

  async setEntityUpdated(id: any) {
    const query = 'UPDATE entities SET updated_at=$1 WHERE id=$2'
    const values = [new Date(), id]

    await this.client.query(query, values)
  }
  async updateEntity(id: any, data: { [x: string]: any; dirty?: any }) {
    const check = 'SELECT * FROM entities WHERE id=$1'
    const cvalues = [id]

    const rows = await this.client.query(check, cvalues)

    if (rows && rows.rows && rows.rows.length > 0) {
      data.dirty = 'true'
      let q = ''
      let dataArray = Object.keys(data)
      dataArray.map(key => {
        if (data[key] !== null) {
          q += `${key}='${('' + data[key]).replace("'", "''")}',`
        }
      })

      const query = 'UPDATE entities SET ' + q + ' updated_at=$1 WHERE id=$2'
      const values = [new Date().toUTCString(), id]
      try {
        return await this.client.query(query, values)
      } catch (e) {
        throw new Error(e)
      }
    } else {
      let q = '',
        cols = ''
      let dataArray = Object.keys(data)
      dataArray.map(key => {
        if (data[key] !== null) {
          cols += `${key},`
          q += `'${('' + data[key]).replace("'", "''")}',`
        }
      })
      cols = cols.slice(0, cols.lastIndexOf(','))
      q = q.slice(0, q.lastIndexOf(','))

      const query = `INSERT INTO entities(${cols}) VALUES (${q})`
      try {
        return await this.client.query(query)
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async addDocument(
    title: any,
    description: any,
    is_included: any,
    store_id: any
  ): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.documentIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query =
      'INSERT INTO documents(id, title, description, is_included, store_id) VALUES($1, $2, $3, $4, $5)'
    const values = [id, title, description, is_included, store_id]

    await this.client.query(query, values)
    return id
  }
  async removeDocument(documentId: string | string[] | undefined) {
    const query = 'DELETE FROM documents WHERE id=$1'
    const values = [documentId]

    await this.client.query(query, values)
  }
  async updateDocument(
    document_id: any,
    title: string,
    description: any,
    is_included: any,
    store_id: any
  ) {
    const query =
      'UPDATE documents SET title=$1, description=$2, is_included=$3, store_id=$4 WHERE id=$5'
    const values = [title, description, is_included, store_id, document_id]

    await this.client.query(query, values)
  }
  async getDocumentsOfStore(
    storeId: string | string[] | undefined
  ): Promise<any> {
    const query =
      'SELECT id, title, description, is_included AS "isIncluded", store_id AS "storeId" FROM documents WHERE store_id=$1 ORDER BY id DESC'
    const values = [storeId]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getAllDocuments(): Promise<any[]> {
    const query = 'SELECT * FROM documents'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getAllDocumentsForSearch(): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE is_included = true'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getDocuments(agent: any): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getSingleDocument(docId: any): Promise<any> {
    const query = 'SELECT * FROM documents WHERE id=$1'
    const values = [docId]

    const rows = await this.client.query(query, values)

    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]
    } else {
      return null
    }
  }
  async getDocumentsWithTopic(agent: any, topic: any): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1 AND topic=$2'
    const values = [agent, topic]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async documentIdExists(documentId: any) {
    const query = 'SELECT * FROM documents WHERE id=$1'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addContentObj(
    title: string,
    description: any,
    is_included: any,
    document_id: any
  ): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.contentObjIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query =
      'INSERT INTO content_objects(id, title, description, is_included, document_id) VALUES($1, $2, $3, $4, $5)'
    const values = [id, title, description, is_included, document_id]

    await this.client.query(query, values)
    return id
  }
  async editContentObj(
    obj_id: any,
    title: string,
    description: any,
    is_included: any,
    document_id: any
  ) {
    const query =
      'UPDATE content_objects SET title=$1, description = $2, is_included = $3, document_id = $4 WHERE id = $5'
    const values = [title, description, is_included, document_id, obj_id]
    await this.client.query(query, values)
  }
  async getContentObjOfDocument(
    documentId: string | string[] | undefined
  ): Promise<any> {
    const query =
      'SELECT id, title, description, is_included AS "isIncluded", document_id AS "documentId" FROM content_objects WHERE document_id = $1 ORDER BY id DESC'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async removeContentObject(objId: string | string[] | undefined) {
    const query = 'DELETE FROM content_objects WHERE id=$1'
    const values = [objId]

    await this.client.query(query, values)
  }
  async contentObjIdExists(contentObjId: any) {
    const query = 'SELECT * FROM content_objects WHERE id=$1'
    const values = [contentObjId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addDocumentStore(name: any): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.documentStoreIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query = 'INSERT INTO documents_store(id, name) VALUES($1,$2)'
    const values = [id, name]

    await this.client.query(query, values)
    return id
  }
  async updateDocumentStore(storeId: any, name: any) {
    const query = 'UPDATE documents_store SET name = $1 WHERE id = $2'
    const values = [name, storeId]
    await this.client.query(query, values)
  }
  async removeDocumentStore(storeId: string | string[] | undefined) {
    const query = 'DELETE FROM documents_store WHERE id = $1'
    const values = [storeId]
    await this.client.query(query, values)
  }
  async getDocumentStores(): Promise<any[]> {
    const query = 'SELECT * FROM documents_store'
    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async getSingleDocumentStore(name: any): Promise<any[]> {
    const query = 'SELECT * FROM documents_store WHERE name=$1'
    const values = [name]

    const rows = await this.client.query(query, values)

    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]
    } else {
      return []
    }
  }
  async documentStoreIdExists(documentStoreId: any) {
    const query = 'SELECT * FROM documents_store WHERE id=$1'
    const values = [documentStoreId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async dataIsHandled(id: string, client: string): Promise<boolean> {
    const query = 'SELECT * FROM handled_history WHERE _id=$1 AND client=$2'
    const values = [id, client]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? true : false
  }
  async setDataHandled(
    id: string,
    client: string,
    data: string
  ): Promise<void> {
    const query =
      'INSERT INTO handled_history(_id, client, data) VALUES($1, $2, $3)'
    const values = [id, client, data]

    await this.client.query(query, values)
  }
}
