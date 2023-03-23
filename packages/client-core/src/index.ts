import { pluginManager } from '@magickml/engine'

import defaultTemplates from './templates'
export * from './components'

export * from './plugins'

const spellTemplates = pluginManager.getSpellTemplates()
const projectTemplates = pluginManager.getProjectTemplates()

export const templates = {
    projects: [
        ...defaultTemplates.projects,
        ...projectTemplates,
    ],
    spells: [
        ...defaultTemplates.spells,
        ...spellTemplates,
    ],
}