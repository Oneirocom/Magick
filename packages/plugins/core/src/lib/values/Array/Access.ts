import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const arrayAccess = makeInNOutFunctionDesc({
  name: 'logic/array/access',
  category: NodeCategory.Logic,
  label: 'Array Access',
  in: ['array', 'integer'],
  out: 'string',
  exec: (a: unknown[], b: number) => a[b],
})
