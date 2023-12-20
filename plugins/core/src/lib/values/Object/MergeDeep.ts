import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { mergeDeepRight } from 'rambdax'

/**
 * Creates a new object with the own properties of the first object merged with the own
 * properties of the second object. If a key exists in both objects:
 * and both values are objects, the two values will be recursively merged
 * otherwise the value from the second object will be used.
 * See [Rambdax's mergeDeepRight](https://selfrefactor.github.io/rambdax/#/?id=mergeDeepRight)
 */
export const MergeDeep = makeInNOutFunctionDesc({
  name: 'logic/mergeDeep/object',
  category: NodeCategory.Logic,
  label: 'Merge Deep',
  in: ['object', 'object'],
  out: 'object',
  exec: (a: object, b: object) => mergeDeepRight(a, b),
})
