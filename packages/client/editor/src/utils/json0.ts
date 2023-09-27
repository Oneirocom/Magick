// DOCUMENTED
/**
 * Calculates the difference between two objects using an operational transformation approach.
 *
 * @param obj1 - The first object that will be compared.
 * @param obj2 - The second object that will be compared.
 * @returns The difference between the two objects.
 */
import jsonDiff from 'json0-ot-diff'
import diffMatchPatch from 'diff-match-patch'

export function diff(obj1: any, obj2: any): any {
  return jsonDiff(obj1, obj2, diffMatchPatch)
}
