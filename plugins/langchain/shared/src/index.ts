// DOCUMENTED 
/**
 * Imports
 */

import { MagickComponent } from '@magickml/core';
import { AgentExecutor } from './nodes/AgentRecommender';
export function getNodes(): MagickComponent<any>[] {
  return [
    AgentExecutor as any,
  ]
}
/**
 * Export the nodes as an array
 */
export default [
  AgentExecutor
];