import type { Sequelize } from 'sequelize'
import type { entitiesAttributes, entitiesCreationAttributes } from './entities'
import { entities as _entities } from './entities'
import type { spellsAttributes, spellsCreationAttributes } from './spells'
import { spells as _spells } from './spells'
import type { eventsAttributes, eventsCreationAttributes } from './events'
import { events as _events } from './events'
import type {
  documentsAttributes,
  documentsCreationAttributes,
} from './documents'
import { documents as _documents } from './documents'
import type {
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
} from './documentstores'
import { documentsStore as _documentsStore } from './documentstores'
import type {
  contentObjAttributes,
  contentObjCreationAttributes,
} from './content_objects'
import { contentObj as _contentObj } from './content_objects'

export {
  _entities as entities,
  _spells as spells,
  _events as events,
  _documents as documents,
  _documentsStore as documentsStore,
  _contentObj as contentObj,
}

export type {
  entitiesAttributes,
  entitiesCreationAttributes,
  spellsAttributes,
  spellsCreationAttributes,
  eventsAttributes,
  eventsCreationAttributes,
  documentsAttributes,
  documentsCreationAttributes,
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
  contentObjAttributes,
  contentObjCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const entities = _entities.initModel(sequelize)
  const spells = _spells.initModel(sequelize)
  const events = _events.initModel(sequelize)
  const documentsStore = _documentsStore.initModel(sequelize)
  const documents = _documents.initModel(sequelize)
  const contentObj = _contentObj.initModel(sequelize)

  return {
    entities: entities,
    spells: spells,
    events: events,
    contentObj: contentObj,
    documents: documents,
    documentsStore: documentsStore,
  }
}
