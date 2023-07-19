// DOCUMENTED
/**
 * Imports
 */

import { MagickComponent } from '@magickml/core'
import { IntentSearch } from './nodes/IntentSearch'

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): (typeof MagickComponent<any>)[] {
  return [IntentSearch]
}

export default [IntentSearch]
