// DOCUMENTED
/**
 * An array of spell templates in JSON format.
 *
 * @typedef {Object[]} SpellTemplates
 */

import Starter from './spells/Starter.spell.json'
import Blank from './spells/Blank.spell.json'

/**
 * An array of spell templates in JSON format.
 *
 * @type {SpellTemplates}
 */
const spellTemplates = [Starter, Blank]

/**
 * An empty array to hold project templates.
 *
 * @type {any[]}
 */
const projectTemplates = []

/**
 * An object that exports spellTemplates and projectTemplates.
 */
const templateData = {
  spells: spellTemplates,
  projects: projectTemplates,
}

export default templateData
