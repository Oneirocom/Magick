import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const arrayIncludes = makeInNOutFunctionDesc({
  name: 'logic/array/includes',
  category: NodeCategory.Logic,
  label: 'Includes',
  in: ['array', 'string'],
  out: 'boolean',
  exec: (a: unknown[], b: string) => a.includes(b),
})
