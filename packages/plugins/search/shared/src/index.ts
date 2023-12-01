// DOCUMENTED
/**
 * This is the main file exporting the nodes used in the app
 */

import { MagickComponent, PluginSecret } from 'shared/core'
import { SearchGoogle } from './nodes/SearchGoogle'
import { SearchMetaphor } from './nodes/SearchMetaphor'

export const secrets: PluginSecret[] = [
  {
    name: 'Metaphor API Key',
    key: 'metaphor_api_key',
    global: true,
    getUrl: 'https://dashboard.metaphor.systems/overview',
  },
]
/**
 * Export an array of all nodes used in the plugin
 * @returns MagickComponent[]
 */
export function getNodes(): MagickComponent<any>[] {
  return [SearchGoogle as any, SearchMetaphor as any]
}
