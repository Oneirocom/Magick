// DOCUMENTED
/**
 * This is the main file exporting the nodes used in the app
 */

import { MagickComponent } from '@magickml/core'
import { SearchGoogle } from './nodes/SearchGoogle'

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): MagickComponent<any>[] {
  return [SearchGoogle as any]
}