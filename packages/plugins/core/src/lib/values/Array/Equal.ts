import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { equals } from 'rambdax'

/**
 * Returns true if its arguments are equivalent, false otherwise. Handles cyclical
 *  data structures. Dispatches symmetrically to the equals methods of both
 * arguments, if present.
 * See [Rambdax's equals](https://selfrefactor.github.io/rambdax/#/?id=equals)
 */
export const ArrayEqual = makeInNOutFunctionDesc({
  name: 'logic/equal/array',
  category: NodeCategory.Logic,
  label: '=',
  in: ['array', 'array'],
  out: 'boolean',
  exec: (a: unknown[], b: unknown[]) => equals(a, b),
})
