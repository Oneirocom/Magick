// DOCUMENTED
/**
 * This module exports optimized and refactored code of the original implementation.
 * @module optimizedClientCore
 */
import defaultTemplates from './templates'

export * from './components'

/**
 * Gets project and spell templates and returns default templates and
 * templates of previously loaded plugins.
 * @returns {Object} templates object containing the projects and spells
 */
export const getTemplates = () => ({
  projects: [...defaultTemplates.projects],
  spells: [...defaultTemplates.spells],
})
