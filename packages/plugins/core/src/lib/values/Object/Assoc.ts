import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { assocPath } from 'rambdax'

/**
 * It makes a shallow clone of obj with setting or overriding with newValue the property found with path. See [Rambdax's assocPath](https://selfrefactor.github.io/rambdax/#/?id=assocpath)
 */
export const AssocPath = makeInNOutFunctionDesc({
  name: 'logic/assocPath/object',
  category: NodeCategory.Logic,
  label: 'Assoc Path',
  in: [
    {
      path: 'string',
    },
    {
      newValue: 'object',
    },
    {
      obj: 'object',
    },
  ],
  out: 'object',
  exec: (pathStr: string, newValue: object, obj: object) => {
    const path = pathStr.split('.')
    return assocPath(path, newValue, obj)
  },
})
