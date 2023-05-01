// DOCUMENTED
/**
 * This file contains the implementation of the TaskService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { app } from '../../app'
import type { Application } from '../../declarations'
import type { Task, TaskData, TaskPatch, TaskQuery } from './tasks.schema'
import { DATABASE_TYPE } from '@magickml/core'

export type TaskParams = KnexAdapterParams<TaskQuery>

/**
 * The TaskService class extends KnexService and provides tailored
 * functionality for working with the tasks schema in the database.
 *
 * ServiceParams specifies the Params type for the service.
 */
export class TaskService<
  ServiceParams extends Params = TaskParams
> extends KnexService<Task, TaskData, ServiceParams, TaskPatch> {
  /**
   * Create a new task.
   * Currently, this function simply returns the provided task data immediately.
   * @param {TaskData} data - The task data object.
   * @returns {Promise<any>} - The created task data.
   */
  // @ts-ignore
  async create(data: TaskData): Promise<any> {
    if (DATABASE_TYPE == 'pg') {
      const cli = app.get('vectordb')
      await cli.from('tasks').insert(data)
    }
    return data
  }

  /**
   * Remove an task.
   * This function deletes an task from the vector database given an task ID.
   * @param {string} id - The task ID.
   * @returns {Promise<any>} - The result of the delete operation.
   */
  async remove(id: string): Promise<any> {
    if (DATABASE_TYPE == 'sqlite') {
      const vectordb = app.get('vectordb')
      const r = vectordb.delete(id)
      return r
    } else {
      const db = app.get('dbClient')
      const _ = await db('tasks').where('id', id).del()
      return _
    }
  }

  /**
   * Find tasks.
   * This function searches for tasks in the database given an embedding and other query parameters.
   * @param {ServiceParams} [params] - The query parameters for the search.
   * @returns {Promise<any>} - The search results.
   */
  // @ts-ignore
  async find(params?: ServiceParams) {
    const db = app.get('dbClient')
    const cli = app.get('vectordb')
    if (DATABASE_TYPE == 'sqlite') {
      const vectordb = app.get('vectordb')
      if (params.query.embedding) {
        const blob = atob(params.query.embedding)
        const ary_buf = new ArrayBuffer(blob.length)
        const dv = new DataView(ary_buf)
        for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
        const f32_ary = new Float32Array(ary_buf)
        const query = f32_ary as unknown as number[]
        const { $limit: _, ...param } = params.query

        const search_result = await vectordb.extractMetadataFromResults(
          query,
          2,
          param
        )
        if (search_result) {
          return { tasks: search_result }
        }
      }
      //@ts-ignore
      const { $limit: _, ...param } = params
      const tr = await vectordb.getDataWithMetadata(param, 10)
      return { tasks: tr }
    } else {
      if (params.query.embedding) {
        const blob = atob(params.query.embedding)
        const ary_buf = new ArrayBuffer(blob.length)
        const dv = new DataView(ary_buf)
        for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
        const f32_ary = new Float32Array(ary_buf)
        const query = f32_ary as unknown as number[]
        const { $limit: _, ...param } = params.query
        const querys = await db('tasks')
          .select('*')
          .where({
            ...(param.type && { type: param.type }),
            ...(param.id && { id: param.id }),
            ...(param.sender && { sender: param.sender }),
            ...(param.client && { client: param.client }),
            ...(param.channel && { channel: param.channel }),
            ...(param.projectId && { projectId: param.projectId }),
            ...(param.content && { content: param.content }),
          })
          .orderByRaw(`embedding <-> ${"'[" + f32_ary.toString() + "]'"}`)
        const result = await db.raw(
          `select * from tasks order by embedding <-> ${
            "'[" + f32_ary.toString() + "]'"
          } limit 1;`
        )
        const bod = {
          query_embedding: '[' + f32_ary.toString() + ']',
          match_count: 2,
          content_to_match: param.content,
        }
        const rr = await cli.rpc('match_tasks', bod)
        console.log("result", rr)
        return { tasks: querys }
      }
      console.log("RES:", params)
      const res = await cli.from('tasks').select()
                                          .where((builder) => {
                                            if (params.query.content) {
                                              builder.where('content', params.query.content);
                                            }
                                            if ('$limit' in params.query) {
                                              builder.limit(params.query['$limit']);
                                            }
                                            if (params.query.projectId) {
                                              builder.where('projectId', params.query.projectId);
                                            }
                                          });
      console.log("RES:", res)
      return { tasks: (res as unknown as { data: Array<any> }) }
    }
  }
}

/**
 * Get options for the task service.
 * This function returns the options required by the KnexAdapter.
 * @param {Application} app - The Feathers application object.
 * @returns {KnexAdapterOptions} - The options required by KnexAdapter.
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'tasks',
  }
}
