import { NotFound } from '@feathersjs/errors/lib'
import { KnexAdapter } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { Paginated, Params } from '@feathersjs/feathers'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type {
  SeraphEventData,
  SeraphEventPatch,
  SeraphEventQuery,
} from './seraph.schema'
import { ISeraphEvent } from 'servicesShared'
import { app } from '../../app'

export type SeraphEventParams = KnexAdapterParams<SeraphEventQuery>

export class SeraphService<
  ServiceParams extends Params = SeraphEventParams
> extends KnexAdapter<
  ISeraphEvent,
  SeraphEventData,
  ServiceParams,
  SeraphEventPatch
> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }
  async get(
    seraphEventId: string,
    params: ServiceParams
  ): Promise<ISeraphEvent> {
    const query = super.createQuery(params)
    const seraphEvent = await query
      .where('seraphEvent.id', '=', seraphEventId)
      .first()

    if (!seraphEvent) {
      throw new NotFound(`No seraph event with id ${seraphEventId} was found.`)
    }

    return seraphEvent
  }

  async find(params: ServiceParams): Promise<Paginated<ISeraphEvent>> {
    return this._find(params) as Promise<Paginated<ISeraphEvent>>
  }

  async create(params: SeraphEventData): Promise<ISeraphEvent> {
    app.get('logger').debug('Creating seraph event: %o', params)
    const seraph = app.get('seraphCore')

    const systemPrompt = await seraph.generateSystemPrompt()
    if (!systemPrompt) throw new Error('Failed to generate system prompt')

    const newSeraphEventParams = {
      ...params,
      systemPrompt,
    }

    console.log('HELLO', newSeraphEventParams)
    return this._create(newSeraphEventParams)
  }

  async getSeraphChatHistory(params: ServiceParams): Promise<ISeraphEvent[]> {
    return this._find(params) as Promise<ISeraphEvent[]>
  }
}

/**
 * Returns options for KnexAdapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 100,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'seraphEvents',
  }
}
