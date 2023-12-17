import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const ObjectConstant = makeInNOutFunctionDesc({
  name: 'logic/object',
  category: NodeCategory.Logic,
  label: 'Object',
  in: ['object'],
  out: 'object',
  exec: (a: object) => a,
})
