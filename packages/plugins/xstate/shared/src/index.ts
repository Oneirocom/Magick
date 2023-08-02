// DOCUMENTED 
/**
 * Imports
 */

import { MagickComponent } from '@magickml/core'
import { XStateNodeTransition } from './nodes/XStateNodeTransition';

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): (typeof MagickComponent<any>)[] {
  return [XStateNodeTransition]
}

export default [XStateNodeTransition]
