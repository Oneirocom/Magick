// GENERATED 
/**
 * Importing spell templates from JSON files.
 */
import Starter from './spells/Starter.spell.json';
import Blank from './spells/Blank.spell.json';

/**
 * An array containing imported spell objects.
 */
const spellTemplates = [Starter, Blank];

/**
 * An empty array that will contain project templates.
 */
const projectTemplates = [];

/**
 * Exporting an object containing spell and project templates.
 */
export default {
  spells: spellTemplates,
  projects: projectTemplates,
};