/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import pg from 'pg'
import {
  AddClient,
  AddConfiguration,
  AddScope,
  ClientFilterOptions,
  ConfigurationFilterOptions,
  EditClient,
  EditConfiguration,
  EditScope,
  ScopeFilterOptions,
} from './routes/settings/types'
import { isValidObject, makeUpdateQuery } from './utils/utils'
import format from 'pg-format'
import { auth, IAuth } from './middleware/auth'
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const { Client } = pg

const PGSSL = process.env.PGSSL === 'true'
export class database {
  static instance: database

  pool: any
  client: pg.Client

  constructor() {
    database.instance = this
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
    await this.client.query('SELECT NOW()')
  }

  async firstInit() {
    const check = 'SELECT * FROM "public"."spells"'
    const r = await this.client.query(check)

    if (!r || !r.rows || r.rows.length <= 0) {
      const cquery =
        'INSERT INTO "public"."spells" ("id","name","graph","created_at","updated_at","deleted_at","user_id","modules","game_state") VALUES (\'3599a8fa-4e3b-4e91-b329-43a907780ea7\',\'default\',\'{"id": "demo@0.1.0", "nodes": {"1": {"id": 1, "data": {"name": "Input", "text": "Input text here", "outputs": [], "socketKey": "98d25387-d2b3-493c-b61c-ec20689fb101", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [], "receivePlaytest": false}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 5, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}}, "position": [-558.857827667479, -287.8964566771861]}, "2": {"id": 2, "data": {"name": "Trigger", "socketKey": "5ce31be1-de07-4669-8ca6-61463cb2c74d", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 5, "input": "trigger"}, {"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-570.1478847920745, -18.81676187432589]}, "3": {"id": 3, "data": {"socketKey": "6e5d5852-b5a6-410c-8f8c-37ea5a32532b"}, "name": "Module Trigger Out", "inputs": {"trigger": {"connections": []}}, "outputs": {}, "position": [83.9492364030962, -61.88793070021913]}, "5": {"id": 5, "data": {"name": "Output", "socketKey": "1a13b0de-0ec2-40b9-b139-0e44674cf090", "dataControls": {"name": {"expanded": true}}}, "name": "Module Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [103.51577963166771, -267.8995017050695]}, "6": {"id": 6, "data": {"inputs": [{"name": "outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [59.65794741138853, -516.9197232909086]}}}\',\'2022-02-04 10:45:31.638981+00\',\'2022-02-04 10:58:13.785909+00\',NULL,\'0\',\'[]\',\'{}\');'
      await this.client.query(cquery)
    }
  }

  async createEvent(
    type: string,
    agent: any,
    client: any,
    channel: any,
    sender: any,
    text: string | any[]
  ) {
    const query =
      'INSERT INTO events(type, agent, client, channel, sender, text, date) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values = [
      type,
      agent,
      client,
      channel,
      sender,
      text,
      new Date().toUTCString(),
    ]

    await this.client.query(query, values)
  }
  async getEvents(
    type: string,
    agent: any,
    sender: any,
    client: any,
    channel: any,
    asString: boolean = true,
    maxCount: number = 10,
    target_count: string | null,
    max_time_diff: number
  ) {
    // TODO: Make this better and more flexible, this hand sql query sucks. use sequelize
    let query, values
    if (!channel) {
      query =
        'SELECT * FROM events WHERE agent=$1 AND client=$2 AND sender=$3 AND type=$4 ORDER BY id desc'
      values = [agent, client, sender, type]
    } else if (!sender) {
      query =
        'SELECT * FROM events WHERE agent=$1 AND client=$2 AND channel=$3 AND type=$4 ORDER BY id desc'
      values = [agent, client, channel, type]
    } else {
      if (target_count === 'single') {
        query =
          'SELECT * FROM events WHERE agent=$1 AND client=$2 AND sender=$3 AND channel=$4 AND type=$5 ORDER BY id desc'
      } else {
        query =
          'SELECT * FROM events WHERE agent=$1 AND client=$2 AND sender=$3 OR sender=$1 AND channel=$4 AND type=$5 ORDER BY id desc'
      }
      values = [agent, client, sender, channel, type]
    }
    const row = await this.client.query(query, values)
    if (!row || !row.rows || row.rows.length === 0) {
      console.log('rows are null, returning')
      return asString ? '' : []
    }

    // row.rows.sort(function (
    //   a: { date: string | number | Date },
    //   b: { date: string | number | Date }
    // ) {
    //   return new Date(b.date) - new Date(a.date)
    // })

    console.log('got ' + row.rows.length + ' rows')

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

      data +=
        (type === 'conversation' || 'history'
          ? row.rows[i].sender + ': '
          : '') +
        row.rows[i].text +
        (type === 'conversation' || 'history'
          ? '\n'
          : type === 'facts'
            ? '. '
            : '')
      count++
      if (count >= max_length) {
        break
      }
    }
    console.log('returning data', data)
    return asString
      ? data.split('\n').reverse().join('\n')
      : data.split('\n').reverse()
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
      console.log('query :: ', query)
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
    console.log('query called', query, values)
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
  async createEntity() {
    const query = 'INSERT INTO entities (personality) VALUES ($1)'
    const values = ['common']
    console.log('called ', query)
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }
  async updateEntity(id: any, data: { [x: string]: any; dirty?: any }) {
    console.log('updateEntity', id, data)
    const check = 'SELECT * FROM entities WHERE id=$1'
    const cvalues = [id]

    const rows = await this.client.query(check, cvalues)
    console.log('rows', id, data)

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
      console.log('called ', query)
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
      console.log('called ', query)
      try {
        return await this.client.query(query)
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async getGreetings(enabled: boolean) {
    const whereClause = 'WHERE enabled = true'
    const query = `SELECT id, enabled, send_in AS "sendIn", channel_id AS "channelId", message FROM greetings ${enabled ? whereClause : ''
      } ORDER BY id ASC`
    const rows = await this.client.query(query)
    return rows.rows
  }

  async getGreeting(id: string) {
    const query =
      'SELECT id, enabled, send_in AS "sendIn", channel_id AS "channelId", message FROM greetings WHERE id = $1 ORDER BY id ASC'
    const values = [id]
    const rows = await this.client.query(query, values)
    return rows.rows
  }

  async addGreeting(
    enabled: boolean,
    sendIn: string,
    channelId: string,
    message: string
  ) {
    const query =
      'INSERT INTO greetings (enabled, send_in, channel_id, message) VALUES ($1, $2, $3, $4)'
    const values = [enabled, sendIn, channelId, message]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }

  async updateGreeting(
    enabled: boolean,
    sendIn: string,
    channelId: string,
    message: string,
    id: string
  ) {
    const query =
      'UPDATE greetings SET enabled = $1, send_in = $2, channel_id = $3, message = $4 WHERE id = $5'
    const values = [enabled, sendIn, channelId, message, id]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }

  async deleteGreeting(id: string) {
    const query = 'DELETE FROM greetings WHERE id=$1'
    const values = [id]
    return await this.client.query(query, values)
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

    console.log('document store id:', id)

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
    title: any,
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

  async getCalendarEventById(id: string) {
    const query =
      'SELECT id, calendar_id, name, date, time, type, more_info AS "moreInfo" FROM calendar_events WHERE id=$1'
    const rows = await this.client.query(query, [id])

    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }

  async getCalendarEventByCalId(id: string) {
    const query =
      'SELECT id, calendar_id, name, date, time, type, more_info AS "moreInfo" FROM calendar_events WHERE calendar_id=$1'
    const rows = await this.client.query(query, [id])

    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }

  async getCalendarEvents() {
    const query =
      'SELECT id, name, date, time, type, more_info AS "moreInfo" FROM calendar_events'
    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async createCalendarEvent(
    name: string,
    calendar_id: string,
    date: string,
    time: string,
    type: string,
    moreInfo: string
  ) {
    const query =
      'INSERT INTO calendar_events(name, calendar_id, date, time, type, more_info) VALUES ($1, $2, $3, $4, $5, $6)'
    const values = [name, calendar_id, date, time, type, moreInfo]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }
  async editCalendarEvent(
    id: string,
    name: string,
    date: string,
    time: string,
    type: string,
    moreInfo: string
  ) {
    const query =
      'UPDATE calendar_events SET name = $1, date = $2, time = $3, type = $4, more_info = $5 WHERE id = $6'
    const values = [name, date, time, type, moreInfo, id]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }
  async deleteCalendarEvent(id: string) {
    const query1 =
      'SELECT id, name, calendar_id, date, time, type, more_info AS "moreInfo" FROM calendar_events WHERE id = $1'
    const rows = await this.client.query(query1, [id])

    let body: object[] = []

    if (rows && rows.rows && rows.rows.length > 0) {
      body = rows.rows
    }

    const query2 = 'DELETE FROM calendar_events WHERE id = $1'
    const values = [id]
    const res = await this.client.query(query2, values)

    const { command, rowCount } = res
    if (command === 'DELETE' && rowCount > 0) {
      return body
    }
    return {}
  }
  /*
    Section : Settings
    Modules : Client, Configuration, Scope
  */

  // Client settings start

  async getClientSettingByName(name: string) {
    const query =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE name=$1 AND is_deleted=false'
    const values = [name]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getClientSettingById(id: string | number): Promise<any> {
    const query =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE id=$1 AND is_deleted=false'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getAllClientSetting({
    page,
    per_page,
  }: ClientFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false ORDER BY id ASC LIMIT $1 OFFSET $2'

    const query2 =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const rows = await this.client.query(query, [per_page, offset])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllClientSettingsUsingFieldAndSearch({
    page,
    per_page,
    field,
    search,
  }: ClientFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false AND ${field} LIKE '%' || $3 || '%' ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }

      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllClientSettingsUsingSearch({
    page,
    per_page,
    search,
  }: ClientFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false AND (name LIKE '%' || $3 || '%' OR client LIKE '%' || $3 || '%' OR default_value LIKE '%' || $3 || '%' OR type LIKE '%' || $3 || '%') ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async seedClientSetting(body: AddClient[]): Promise<any> {
    let newBody = []

    for (let i = 0; i < body.length; i++) {
      const client = body[i].client
      const name = body[i].name
      const type = body[i].type
      const default_value = body[i].defaultValue

      newBody.push([client, name, type, default_value])
    }

    const query = format(
      'INSERT INTO client_settings (client, name, type, default_value) VALUES %L returning id',
      newBody
    )

    try {
      await this.client.query(query)
      return { success: true, data: {}, isAlreadyExists: false }
    } catch (error) {
      console.log('Error => seedClientSetting => ', error)
    }
    return { success: false, data: {}, isAlreadyExists: false }
  }

  async addClientSetting(body: AddClient): Promise<any> {
    const { client, defaultValue, name, type } = body

    const data = await this.getClientSettingByName(name)

    if (!isValidObject(data)) {
      const query =
        'INSERT INTO client_settings(client, name, type, default_value) VALUES($1, $2, $3, $4)'

      const values: any = [client, name, type, defaultValue]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'INSERT' && rowCount > 0) {
          const data = await this.getClientSettingByName(name)
          return { success: true, data: data, isAlreadyExists: false }
        }
      } catch (error) {
        console.log('Error => addClientSetting => ', error)
      }
      return { success: false, data: {}, isAlreadyExists: false }
    }
    return { success: false, data: data, isAlreadyExists: true }
  }

  async editClientSetting(body: EditClient, id: string | number): Promise<any> {
    const data = await this.getClientSettingById(id)

    const cols = Object.keys(body).map(key =>
      key === 'defaultValue' ? 'default_value' : key
    )

    const idKey = cols.length + 1

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'client_settings',
        wheres: { id: `$${idKey}`, is_deleted: false },
        cols: cols,
      })

      const values: any = [...Object.values(body), id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getClientSettingById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => editClientSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async deleteClientSetting(id: string | number): Promise<any> {
    const data = await this.getClientSettingById(id)

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'client_settings',
        wheres: { id: `$2`, is_deleted: false },
        cols: ['is_deleted'],
      })

      const values: any = [true, id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getClientSettingById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => deleteClientSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async getSingleClient(id: string): Promise<any> {
    try {
      const query = `SELECT id, client, name, type, default_value FROM client_settings WHERE id=$1 AND is_deleted=false`

      const rows = await this.client.query(query, [id])

      if (rows && rows.rows && rows.rows.length > 0) {
        return { success: true, data: rows.rows[0] }
      }
      throw new Error('Client not found')
    } catch (error) {
      return { success: false, data: {} }
    }
  }

  // Client settings end

  // Configuration settings start

  async getConfigurationSettingByName(key: string) {
    const query =
      'SELECT id, key, value FROM configuration_settings WHERE key=$1 AND is_deleted=false'
    const values = [key]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getAllConfigurationSettings({
    page,
    per_page,
  }: ConfigurationFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, key, value FROM configuration_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query =
      'SELECT id, key, value FROM configuration_settings WHERE is_deleted=false ORDER BY id ASC LIMIT $1 OFFSET $2'

    const rows = await this.client.query(query, [per_page, offset])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllConfigurationSettingsUsingFieldAndSearch({
    page,
    per_page,
    field,
    search,
  }: ConfigurationFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, key, value FROM configuration_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, key, value FROM configuration_settings WHERE is_deleted=false AND ${field} LIKE '%' || $3 || '%' ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllConfigurationSettingsUsingSearch({
    page,
    per_page,
    search,
  }: ConfigurationFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, key, value FROM configuration_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, key, value FROM configuration_settings WHERE is_deleted=false AND (value LIKE '%' || $3 || '%' OR key LIKE '%' || $3 || '%') ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getConfigurationSettingsById(id: string | number): Promise<any> {
    const query =
      'SELECT id, key, value FROM configuration_settings WHERE id=$1 AND is_deleted=false'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async addConfigurationSetting(body: AddConfiguration): Promise<any> {
    const { value, key } = body

    const data = await this.getConfigurationSettingByName(key)

    if (!isValidObject(data)) {
      const query =
        'INSERT INTO configuration_settings(key, value) VALUES($1, $2)'

      const values: any = [key, value]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'INSERT' && rowCount > 0) {
          const data = await this.getConfigurationSettingByName(key)
          return { success: true, data: data, isAlreadyExists: false }
        }
      } catch (error) {
        console.log('Error => addConfigurationSetting => ', error)
      }
      return { success: false, data: {}, isAlreadyExists: false }
    }
    return { success: false, data: data, isAlreadyExists: true }
  }

  async editConfigurationSetting(
    body: EditConfiguration,
    id: string | number
  ): Promise<any> {
    const { value, key } = body

    const data = await this.getConfigurationSettingsById(id)

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'configuration_settings',
        wheres: { id: `$${3}`, is_deleted: false },
        cols: ['key', 'value'],
      })

      const values: any = [key, value, id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getConfigurationSettingsById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => editConfigurationSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async deleteConfigurationSetting(id: string | number): Promise<any> {
    const data = await this.getConfigurationSettingsById(id)

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'configuration_settings',
        wheres: { id: `$2`, is_deleted: false },
        cols: ['is_deleted'],
      })

      const values: any = [true, id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getConfigurationSettingsById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => deleteConfigurationSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async getSingleConfiguration(id: string): Promise<any> {
    try {
      const query = `SELECT id, key, value FROM configuration_settings WHERE id=$1 AND is_deleted=false`

      const rows = await this.client.query(query, [id])

      if (rows && rows.rows && rows.rows.length > 0) {
        return { success: true, data: rows.rows[0] }
      }
      throw new Error('Configuration not found')
    } catch (error) {
      return { success: false, data: {} }
    }
  }

  // Configuration settings end

  // Scope settings start

  async getScopeSettingByName(tables: string) {
    const query =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE tables=$1 AND is_deleted=false'
    const values = [tables]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getAllScopeSettings({
    page,
    per_page,
  }: ScopeFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false ORDER BY id ASC LIMIT $1 OFFSET $2'

    const rows = await this.client.query(query, [per_page, offset])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllScopeSettingsUsingFieldAndSearch({
    page,
    per_page,
    field,
    search,
  }: ScopeFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false AND ${field} LIKE '%' || $3 || '%' ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getAllScopeSettingsUsingSearch({
    page,
    per_page,
    search,
  }: ScopeFilterOptions): Promise<any> {
    let offset = Math.abs(
      (per_page as number) * Math.abs((page as number) - 1)
    ) as number

    const query2 =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false ORDER BY id ASC'

    const rows2 = await this.client.query(query2)

    const total = rows2.rows.length

    const query = `SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false AND (full_table_size LIKE '%' || $3 || '%' OR table_size LIKE '%' || $3 || '%' OR tables LIKE '%' || $3 || '%' OR record_count LIKE '%' || $3 || '%') ORDER BY id ASC LIMIT $1 OFFSET $2`

    const rows = await this.client.query(query, [per_page, offset, search])

    if (rows && rows.rows && rows.rows.length > 0) {
      const data = {
        data: rows.rows,
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / (per_page as any)),
        currentPageTotalItems: rows.rows.length,
      }
      return { data: data, success: true }
    }
    return { data: [], success: false }
  }

  async getScopeSettingsById(id: string | number): Promise<any> {
    const query =
      'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE id=$1 AND is_deleted=false'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async addScopeSetting(body: AddScope): Promise<any> {
    const { fullTableSize, tableSize, tables, recordCount } = body

    const data = await this.getScopeSettingByName(tables)

    if (!isValidObject(data)) {
      const query =
        'INSERT INTO scope_settings(full_table_size, table_size, tables, record_count) VALUES($1, $2, $3, $4)'

      const values: any = [fullTableSize, tableSize, tables, recordCount]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'INSERT' && rowCount > 0) {
          const data = await this.getScopeSettingByName(tables)
          return { success: true, data: data, isAlreadyExists: false }
        }
      } catch (error) {
        console.log('Error => addConfigurationSetting => ', error)
      }
      return { success: false, data: {}, isAlreadyExists: false }
    }
    return { success: false, data: data, isAlreadyExists: true }
  }

  async editScopeSetting(body: EditScope, id: string | number): Promise<any> {
    const { tables, fullTableSize, recordCount, tableSize } = body

    const data = await this.getScopeSettingsById(id)

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'scope_settings',
        wheres: { id: `$${5}`, is_deleted: false },
        cols: ['full_table_size', 'table_size', 'tables', 'record_count'],
      })

      const values: any = [fullTableSize, tableSize, tables, recordCount, id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getScopeSettingsById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => editScopeSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async deleteScopeSetting(id: string | number): Promise<any> {
    const data = await this.getScopeSettingsById(id)

    if (isValidObject(data)) {
      const query = makeUpdateQuery({
        table: 'scope_settings',
        wheres: { id: `$2`, is_deleted: false },
        cols: ['is_deleted'],
      })

      const values: any = [true, id]

      try {
        const res = await this.client.query(query, values)
        const { command, rowCount } = res

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getScopeSettingsById(id)
          return { success: true, data: data, isExists: true }
        }
      } catch (error) {
        console.log('Error => deleteScopeSetting => ', error)
      }
      return { success: false, data: {}, isExists: true }
    }
    return { success: false, data: data, isExists: false }
  }

  async getSingleScope(id: string): Promise<any> {
    try {
      const query = `SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE id=$1 AND is_deleted=false`

      const rows = await this.client.query(query, [id])

      if (rows && rows.rows && rows.rows.length > 0) {
        return { success: true, data: rows.rows[0] }
      }
      throw new Error('Scope not found')
    } catch (error) {
      return { success: false, data: {} }
    }
  }

  // Scope settings end

  async getAuthuserById(id: string): Promise<any> {
    const query =
      'SELECT id, user_id, token FROM auth_users WHERE id=$1 AND is_deleted=false'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getAuthuserByToken(token: string): Promise<any> {
    const query =
      'SELECT id, user_id, token FROM auth_users WHERE token=$1 AND is_deleted=false'
    const values = [token]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async getAuthuserByUserId(user_id: string): Promise<any> {
    const query =
      'SELECT id, user_id, token FROM auth_users WHERE user_id=$1 AND is_deleted=false'
    const values = [user_id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows[0] : {}
  }

  async addAuthUser(body: AddAuthUser): Promise<any> {
    const { token: newToken, user_id } = body
    let isValidToken = false

    try {
      const res1 = await this.getAuthuserByUserId(user_id)

      if (isValidObject(res1)) {
        const { token, user_id } = res1 as any

        const decryptedUserId = auth.verify(token)

        isValidToken = decryptedUserId === user_id

        if (!isValidToken) {
          const query3 =
            'UPDATE auth_users SET token=$2 WHERE user_id=$1 AND is_deleted=false'
          const values3: any = [user_id, newToken]

          const res3 = await this.client.query(query3, values3)
          const { command, rowCount } = res3

          if (command === 'UPDATE' && rowCount > 0) {
            const data = await this.getAuthuserByUserId(user_id)
            return { success: true, data: data, isAlreadyExists: false }
          }
        } else {
          return { success: true, data: res1, isAlreadyExists: true }
        }
      }

      const query2 =
        'INSERT INTO auth_users(token, user_id, email, username, password) VALUES($1, $2, $3, $4, $5)'
      const values2: any = [newToken, user_id, null, null, null]

      const res2 = await this.client.query(query2, values2)
      const { command, rowCount } = res2

      if (command === 'INSERT' && rowCount > 0) {
        const data = await this.getAuthuserByUserId(user_id)
        return { success: true, data: data, isAlreadyExists: false }
      }
      throw new Error('Something break in insert query')
    } catch (error) {
      console.log('Error => addAuthUser => ', error)
      return { success: false, data: {}, isAlreadyExists: false }
    }
  }

  async getAuthuser(user_id: string) {
    try {
      const res1 = await this.getAuthuserByUserId(user_id)

      if (isValidObject(res1)) {
        const { token, user_id } = res1 as any

        const decryptedUserId = auth.verify(token)

        if (decryptedUserId === user_id) {
          return { success: true, data: res1, isAlreadyExists: true }
        }

        // remove token from user
        const query2 = 'UPDATE auth_users SET token=null WHERE user_id=$1'
        const values2: any = [user_id]

        const res2 = await this.client.query(query2, values2)
        const { command, rowCount } = res2

        if (command === 'UPDATE' && rowCount > 0) {
          const data = await this.getAuthuserByUserId(user_id)
          return { success: false, data: data, isAlreadyExists: false }
        }
      }
      return { success: false, data: {}, isAlreadyExists: false }
    } catch (error) {
      console.log('Error => getAuthuser => ', error)
      return { success: false, data: {}, isAlreadyExists: false }
    }
  }

  async getMessageReactions() {
    const query =
      'SELECT id, reaction, spell_handler, discord_enabled, slack_enabled FROM message_reactions'
    const rows = await this.client.query(query)
    return rows && rows.rows && rows.rows.length > 0 ? rows.rows : []
  }
  async addMessageReaction(
    reaction: string,
    spell_handler: string,
    discord_enabled: string,
    slack_enabled: string
  ) {
    const query =
      'INSERT INTO message_reactions(reaction, spell_handler, discord_enabled, slack_enabled) VALUES($1, $2, $3, $4)'
    const values = [reaction, spell_handler, discord_enabled, slack_enabled]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }
  async updateMessageReaction(
    id: string,
    reaction: string,
    spell_handler: string,
    discord_enabled: string,
    slack_enabled: string
  ) {
    const query =
      'UPDATE message_reactions SET reaction=$2, spell_handler=$3, discord_enabled=$4, slack_enabled=$5 WHERE id=$1'
    const values = [id, reaction, spell_handler, discord_enabled, slack_enabled]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }
  async deleteMessageReaction(id: string) {
    const query = 'DELETE FROM message_reactions WHERE id=$1'
    const values = [id]
    try {
      return await this.client.query(query, values)
    } catch (e) {
      throw new Error(e)
    }
  }

  async login(username: string, password: string) {
    if (
      !username ||
      !password ||
      username?.length <= 0 ||
      password?.length <= 0
    ) {
      return false
    }

    const query =
      'SELECT * FROM auth_users WHERE username=$1 AND password=$2 AND is_deleted=false'
    const values = [username, password]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].user_id
    } else {
      return undefined
    }
  }

  async usernameExists(username: string) {
    if (!username || username?.length <= 0) {
      return false
    }

    const query =
      'SELECT * FROM auth_users WHERE username=$1 AND is_deleted=false'
    const values = [username]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? true : false
  }

  async emailExists(email: string) {
    if (!email || email?.length <= 0) {
      return false
    }

    const query = 'SELECT * FROM auth_users WHERE email=$1 AND is_deleted=false'
    const values = [email]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0 ? true : false
  }

  async register(
    email: string,
    username: string,
    password: string,
    user_id: string
  ) {
    console.log('credentials:', email, username, password, user_id)
    if (
      !email ||
      !username ||
      !password ||
      !user_id ||
      email?.length <= 0 ||
      username?.length <= 0 ||
      password?.length <= 0 ||
      user_id?.length <= 0
    ) {
      return 'invalid credentials'
    }
    let query = 'SELECT * FROM auth_users WHERE user_id=$1 AND is_deleted=false'
    const values = [user_id]

    const rows = await this.client.query(query, values)
    console.log('rows.rows.length:', rows.rows.length)
    if (rows && rows.rows && rows.rows.length > 0 && !rows.rows[0].email) {
      if (
        rows.rows[0].username ||
        rows.rows[0].email ||
        rows.rows[0].username.length > 0 ||
        rows.rows[0].email.length > 0
      ) {
        return 'account already registered!'
      }

      query =
        'UPDATE auth_users SET email=$1, username=$2, password=$3 WHERE user_id=$4 AND is_deleted=false'
      const values = [email, username, password, user_id]

      await this.client.query(query, values)
      return 'ok'
    } else {
      const token: any = (auth as IAuth).generate(user_id)
      query =
        'INSERT INTO auth_users(token, user_id, email, username, password) VALUES($1, $2, $3, $4, $5)'
      const values = [token, user_id, email, username, password]

      await this.client.query(query, values)
      return 'ok'
    }
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

type AddAuthUser = {
  user_id: string
  token: string
}
