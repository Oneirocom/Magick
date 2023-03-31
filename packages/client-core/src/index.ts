// DOCUMENTED 
/**
 * This module exports optimized and refactored code of the original implementation.
 * @module optimizedClientCore
 */

import { ClientPluginManager, pluginManager } from '@magickml/engine'
import plugins from './plugins'
import defaultTemplates from './templates'

export * from './components'

console.log('Loading plugins from client-core', Object.keys(plugins))

/**
 * Gets spell templates from plugin manager.
 * @returns {Array} spell templates
 */
const getSpellTemplates = () => (pluginManager as ClientPluginManager).getSpellTemplates();

/**
 * Gets project templates from plugin manager.
 * @returns {Array} project templates
 */
const getProjectTemplates = () => (pluginManager as ClientPluginManager).getProjectTemplates();

/**
 * Gets project and spell templates and returns default templates and
 * templates of previously loaded plugins.
 * @returns {Object} templates object containing the projects and spells
 */
const getTemplates = () => ({
    projects: [
        ...defaultTemplates.projects,
        ...getProjectTemplates(),
    ],
    spells: [
        ...defaultTemplates.spells,
        ...getSpellTemplates(),
    ],
});

export const templates = getTemplates();