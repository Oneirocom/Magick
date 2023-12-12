// DOCUMENTED
/**
 * This file contains the implementation of the EventService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexAdapter } from '@feathersjs/knex'
import { app } from '../../app'
import type { Application } from '../../declarations'
import type { Event, EventData, EventPatch, EventQuery } from './events.schema'

export type EventParams = KnexAdapterParams<EventQuery>

/**
 * The EventService class extends KnexService and provides tailored
 * functionality for working with the events schema in the database.
 *
 * ServiceParams specifies the Params type for the service.
 */
export class EventService<
  ServiceParams extends Params = EventParams
> extends KnexAdapter<Event, EventData, ServiceParams, EventPatch> {
  /**
   * Create a new event.
   * Currently, this function simply returns the provided event data immediately.
   * @param {EventData} data - The event data object.
   * @returns {Promise<any>} - The created event data.
   */
  async create(data: EventData): Promise<any> {
    const db = app.get('vectordb')
    await db.from('events').insert(data)
    return data
  }

  /**
   * Patch an event.
   * Currently, this function simply returns the provided event data immediately.
   * @param {string} id - The ID of the event to patch.
   * @param {EventPatch} data - The event patch data object.
   * @returns {Promise<any>} - The patched event data.
   */
  async patch(id: string, data: EventPatch) {
    return this._patch(id, data)
  }

  async get(id: string, params?: ServiceParams) {
    return this._get(id, params)
  }

  async remove(id: string, params?: ServiceParams) {
    return this._remove(id, params)
  }

  /**
   * Find events.
   * This function searches for events in the database given an embedding and other query parameters.
   * @param {ServiceParams} [params] - The query parameters for the search.
   * @returns {Promise<any>} - The search results.
   */
  // @ts-ignore
  async find(params?: ServiceParams) {
    const db = app.get('dbClient')

    if (!params?.query?.projectId) {
      throw new Error('projectId is required')
    }

    const query = db
      .from('events')
      .select('*')
      .where({ projectId: params?.query?.projectId })

    if (params?.query?.embedding) {
      const blob = atob(params.query.embedding)
      const ary_buf = new ArrayBuffer(blob.length)
      const dv = new DataView(ary_buf)
      for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
      const f32_ary = new Float32Array(ary_buf)

      query.select(
        db.raw(`embedding <-> ${"'[" + f32_ary.toString() + "]'"} AS distance`)
      )
      query.orderBy('distance', 'asc')
    } else {
      // If not searching by embedding, perform a normal query
      query.orderBy('date', 'desc')
    }
    const param = params?.query

    if (param.type) query.where({ type: param.type })
    if (param.sender) query.where({ sender: param.sender })
    if (param.observer) query.where({ observer: param.observer })
    if (param.id) query.where({ id: param.id })
    if (param.client) query.where({ client: param.client })
    if (param.channel) query.where({ channel: param.channel })

    query.limit(param['$limit'])

    const res = await query

    return { events: res as unknown as { data: Array<any> } }
  }
}

/**
 * Get options for the event service.
 * This function returns the options required by the KnexAdapter.
 * @param {Application} app - The Feathers application object.
 * @returns {KnexAdapterOptions} - The options required by KnexAdapter.
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'events',
    multi: ['remove'],
  }
}
