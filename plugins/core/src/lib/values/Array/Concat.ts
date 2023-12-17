import {
  NodeCategory,
  makeFunctionNodeDefinition,
  makeInNOutFunctionDesc,
} from '@magickml/behave-graph'
import { concat } from 'rambdax'

/**
 * Returns the result of concatenating the given lists or strings. See [Rambdax's concat](https://selfrefactor.github.io/rambdax/#/?id=concat)
 */
export const Concat = makeInNOutFunctionDesc({
  name: 'logic/concat/array/2',
  aliases: ['logic/concat/array'],
  category: NodeCategory.Logic,
  label: 'Concat',
  in: ['array', 'array'],
  out: 'array',
  exec: (a: unknown[], b: unknown[]) => concat(a, b),
})

/**
 * Returns the result of concatenating the given lists or strings. See [Rambdax's concat](https://selfrefactor.github.io/rambdax/#/?id=concat)
 */
export const Concat3 = makeInNOutFunctionDesc({
  name: 'logic/concat/array/3',
  category: NodeCategory.Logic,
  label: 'Concat',
  in: ['array', 'array', 'array'],
  out: 'array',
  exec: (a: unknown[], b: unknown[], c: unknown[]) => concat(concat(a, b), c),
})
