// GENERATED 
/**
 * Load plugins and templates for client-side use.
 */

import { ClientPluginManager, pluginManager } from '@magickml/engine';
import plugins from './plugins';
import defaultTemplates from './templates';
export * from './components';

// Log loaded plugins
console.log('Loading plugins from client-core', Object.keys(plugins));

// Get spell and project templates
const spellTemplates = (pluginManager as ClientPluginManager).getSpellTemplates();
const projectTemplates = (pluginManager as ClientPluginManager).getProjectTemplates();

/**
 * Client-side templates
 */
export const templates = {
  /**
   * Available project templates
   */
  projects: [
    ...defaultTemplates.projects,
    ...projectTemplates,
  ],
  /**
   * Available spell templates
   */
  spells: [
    ...defaultTemplates.spells,
    ...spellTemplates,
  ],
};