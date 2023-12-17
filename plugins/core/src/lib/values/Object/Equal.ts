import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { equals } from 'rambdax'

/**
 * Returns true if its arguments are equivalent, false otherwise. Handles cyclical
 * data structures. Dispatches symmetrically to the equals methods of both
 * arguments, if present.
 * See [Rambdax's equals](https://selfrefactor.github.io/rambdax/#/?id=equals)
 * @category Logic
 **/
export const ObjectEqual = makeInNOutFunctionDesc({
  name: 'logic/equal/object',
  category: NodeCategory.Logic,
  label: '=',
  in: ['object', 'object'],
  out: 'boolean',
  exec: (a: object, b: object) => equals(a, b),
})
