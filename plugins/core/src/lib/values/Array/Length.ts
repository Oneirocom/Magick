import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const arrayLength = makeInNOutFunctionDesc({
  name: 'logic/array/length',
  category: NodeCategory.Logic,
  label: 'Length',
  in: ['array'],
  out: 'integer',
  exec: (a: unknown[]) => a.length,
})
