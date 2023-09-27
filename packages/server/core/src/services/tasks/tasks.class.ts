// DOCUMENTED
/**
 * This file contains the implementation of the TaskService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Application, Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import type { Task, TaskData, TaskPatch, TaskQuery } from './tasks.schema'

export type TaskParams = KnexAdapterParams<TaskQuery>

/**
 * The TaskService class extends KnexService and provides tailored
 * functionality for working with the tasks schema in the database.
 *
 * ServiceParams specifies the Params type for the service.
 */
export class TaskService<
  ServiceParams extends Params = TaskParams
> extends KnexService<Task, TaskData, ServiceParams, TaskPatch> {}

/**
 * Returns options for KnexAdapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'tasks',
  }
}
