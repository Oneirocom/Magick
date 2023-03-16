// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Event, EventData, EventPatch, EventQuery } from './events.schema'
import { dbDialect, SupportedDbs } from '../../dbClient'
import { Knex } from 'knex'
import { app } from '../../app'
import { SKIP_DB_EXTENSIONS } from '@magickml/engine'

async function findSimilarEventByEmbedding(db: Knex, embedding) {
  const query: Record<SupportedDbs, any> = {
    [SupportedDbs.pg]: async () => {
      if(SKIP_DB_EXTENSIONS) {
        console.warn('Skipping embedding on postgres, extensions are not loaded')
        return null
      }
      return await db.raw(`select * from events order by embedding <-> ${embedding} limit 1;`)
    },
    [SupportedDbs.sqlite]: async () => {
      if(SKIP_DB_EXTENSIONS) {
        console.warn('Skipping embedding on sqlite, extensions are not loaded')
        return null
      }
      const eventInVssTable = await db.raw(
        `select rowid, distance from vss_events
         where vss_search(
            event_embedding,
            vss_search_params(
              ${embedding},
              1
            )
          )
        ;`
      )
      if (!eventInVssTable?.rowid) return null
      const event = await db('events').where('id', eventInVssTable.rowid).first()
      return event
    }
  }
  let embeddings = null
  try {
    embeddings = await query[dbDialect]()
  } catch (e) {
    console.log(e)
  }
  console.log(embeddings)
  return embeddings
}

export type EventParams = KnexAdapterParams<EventQuery>

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class EventService<ServiceParams extends Params = EventParams> extends KnexService<
  Event,
  EventData,
  ServiceParams,
  EventPatch
> {
  async find(params?: ServiceParams) {
    const db = app.get('dbClient')
    if (params.query.embedding) {
      const blob = atob(params.query.embedding);
      const ary_buf = new ArrayBuffer(blob.length);
      const dv = new DataView(ary_buf);
      for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i));
      const f32_ary = new Float32Array(ary_buf);
      const result = await findSimilarEventByEmbedding(db, "[" + f32_ary + "]")

      if (result) {
        return result
      }
    }
    return super.find(params)
  }

}


export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'events'
  }
}
