import { CreateEventArgs, GetEventArgs } from '@magickml/core'
import weaviate from 'weaviate-client'
import EventSchema from './weaviate_events_schema'

const DOCUMENTS_CLASS_NAME = 'events'
let weaviate_client: any

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime() //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export async function initWeaviateClientEvent() {
  weaviate_client = weaviate.client({
    scheme: process.env.WEAVIATE_CLIENT_SCHEME,
    host: process.env.WEAVIATE_CLIENT_HOST,
  })
  weaviate_client.schema
    .classCreator()
    .withClass(EventSchema)
    .do()
    .then(re => {
      console.log(re)
    })
    .catch(err => {
      console.error(err)
    })
}

export class weaviate_connection {
  static async createEvent({
    type,
    sender,
    observer,
    entities,
    client,
    channel,
    content,
  }: CreateEventArgs) {
    if (!weaviate_client) {
      await initWeaviateClientEvent()
    }
    return await weaviate_client.data
      .creator()
      .withClassName('Event')
      .withId(generateUUID())
      .withProperties({
        type,
        sender,
        observer,
        client,
        channel,
        entities,
        content,
        date: new Date().toUTCString(),
      })
      .do()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }
  static async getEvents({
    type,
    sender = 'system',
    observer = 'none',
    client = 'default',
    channel = 'default',
    maxCount = 10,
    max_time_diff = -1,
  }: GetEventArgs) {
    if (!type) {
      throw new Error('Missing argument for type')
    }
    if (channel === 'undefined') {
      channel = ''
    }
    if (!weaviate_client) {
      await initWeaviateClientEvent()
    }
    const events = await weaviate_client.graphql
      .get()
      .withClassName('Event')
      .withFields([
        'type',
        'observer',
        'sender',
        'entities',
        'client',
        'channel',
        'sender',
        'text',
        'date',
      ])
      .withWhere({
        operator: 'And',
        operands: [
          {
            path: ['observer'],
            operator: 'Equal',
            valueString: observer,
          },
          {
            path: ['sender'],
            operator: 'Equal',
            valueString: sender,
          },
          {
            path: ['client'],
            operator: 'Equal',
            valueString: client,
          },
        ],
      })
      .withLimit(maxCount)
      .do()
      .catch(err => {
        console.log(err)
      })
    const event_obj = events.data.Get.Event
    if (max_time_diff > 0) {
      const now = new Date()
      const filtered = event_obj.filter(e => {
        const diff = now.getTime() - new Date(e.date).getTime()
        return diff < max_time_diff
      })
      return filtered
    }
    return event_obj
  }
  static async getAllEvents() {
    if (!weaviate_client) {
      await initWeaviateClientEvent()
    }
    const events = await weaviate_client.data
      .getter()
      .withClassName('Event')
      .do()
      .catch(err => {
        console.error(err)
      })
    return events
  }
}
