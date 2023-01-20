// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Spell, SpellData, SpellPatch, SpellQuery } from './spells.schema'

export interface SpellParams extends KnexAdapterParams<SpellQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SpellService<ServiceParams extends Params = SpellParams> extends KnexService<
  Spell,
  SpellData,
  ServiceParams,
  SpellPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'spells'
  }
}
