// GENERATED 
/**
 * This file contains the implementation of the EventService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Params } from '@feathersjs/feathers';
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex';
import { KnexService } from '@feathersjs/knex';
import { app } from '../../app';
import type { Application } from '../../declarations';
import type { Event, EventData, EventPatch, EventQuery } from './events.schema';

export type EventParams = KnexAdapterParams<EventQuery>;

/**
 * The EventService class extends KnexService and provides tailored
 * functionality for working with the events schema in the database.
 *
 * ServiceParams specifies the Params type for the service.
 */
export class EventService<ServiceParams extends Params = EventParams> extends KnexService<Event, EventData, ServiceParams, EventPatch> {
  /**
   * Create a new event.
   * Currently, this function simply returns the provided event data immediately.
   * @param {EventData} data - The event data object.
   * @returns {Promise<any>} - The created event data.
   */
  async create(data: EventData): Promise<any> {
    return data;
  }

  /**
   * Remove an event.
   * This function deletes an event from the vector database given an event ID.
   * @param {string} id - The event ID.
   * @returns {Promise<any>} - The result of the delete operation.
   */
  async remove(id: string): Promise<any> {
    const vectordb = app.get('vectordb');
    const r = vectordb.delete(id);
    return r;
  }

  /**
   * Find events.
   * This function searches for events in the database given an embedding and other query parameters.
   * @param {ServiceParams} [params] - The query parameters for the search.
   * @returns {Promise<any>} - The search results.
   */
  async find(params?: ServiceParams) {
    if (params.query.embedding) {
      const blob = atob(params.query.embedding);
      const ary_buf = new ArrayBuffer(blob.length);
      const dv = new DataView(ary_buf);
      for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i));
      const f32_ary = new Float32Array(ary_buf);
      const vectordb = app.get('vectordb');
      const query = f32_ary as unknown as number[];
      const results = vectordb.search(query, params?.query?.$limit);
      if (results) {
        return { events: results };
      }
    }

    const vectordb = app.get('vectordb');
    const { $limit: _, ...param } = params.query;
    const r = vectordb.searchData(
      param as unknown as number[],
      params?.query?.$limit
    );
    return { events: r };
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
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'events',
  };
};