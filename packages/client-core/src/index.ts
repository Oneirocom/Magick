import { ClientPluginManager, pluginManager } from '@magickml/engine'

import defaultTemplates from './templates'
export * from './components'

// TODO: Check if cast is correct
const spellTemplates = (pluginManager as ClientPluginManager).getSpellTemplates()
const projectTemplates = (pluginManager as ClientPluginManager).getProjectTemplates()

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