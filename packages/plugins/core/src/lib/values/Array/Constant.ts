import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

/**
 *   helpDescription: 'Returns the array passed as input',
 */
export const ArrayConstant = makeInNOutFunctionDesc({
  name: 'logic/array',
  category: NodeCategory.Logic,
  label: 'Array',
  in: ['array'],
  out: 'array',
  exec: (a: unknown[]) => a,
})
