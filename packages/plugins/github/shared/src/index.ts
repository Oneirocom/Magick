// DOCUMENTED 
/**
 * Imports
 */

import { MagickComponent } from '@magickml/core'
import { GithubIssueSearch } from './nodes/GithubIssueSearch';

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): (typeof MagickComponent<any>)[] {
  return [GithubIssueSearch]
}

export default [GithubIssueSearch]
