import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { path } from 'rambdax'

/**
 * If pathToSearch is "a.b" then it will return 1 if obj is {a:{b:1}}. It will return
 * undefined, if such path is not found.
 * See [Rambdax\'s path](https://selfrefactor.github.io/rambdax/#/?id=path)"
 */
export const Path = makeInNOutFunctionDesc({
  name: 'logic/path/object',
  category: NodeCategory.Logic,
  label: 'Path',
  in: [
    {
      pathToSearch: 'string',
    },
    {
      obj: 'object',
    },
  ],
  out: 'object',
  exec: (pathToSearch: string, obj: object) => path(pathToSearch, obj),
})

/**
 * If pathToSearch is "a.b" then it will return 1 if obj is {a:{b:1}}. It will return
 * undefined, if such path is not found.
 * See [Rambdax\'s path](https://selfrefactor.github.io/rambdax/#/?id=path)"
 */
export const PathAsString = makeInNOutFunctionDesc({
  name: 'logic/path/string',
  category: NodeCategory.Logic,
  label: 'Path',
  in: [
    {
      pathToSearch: 'string',
    },
    {
      obj: 'object',
    },
  ],
  out: 'string',
  exec: (pathToSearch: string, obj: object) => path(pathToSearch, obj),
})

/**
 * If pathToSearch is "a.b" then it will return 1 if obj is {a:{b:1}}. It will return
 * undefined, if such path is not found.
 * See [Rambdax\'s path](https://selfrefactor.github.io/rambdax/#/?id=path)"
 */
export const PathAsInteger = makeInNOutFunctionDesc({
  name: 'logic/path/integer',
  category: NodeCategory.Logic,
  label: 'Path',
  in: [
    {
      pathToSearch: 'string',
    },
    {
      obj: 'object',
    },
  ],
  out: 'integer',
  exec: (pathToSearch: string, obj: object) => path(pathToSearch, obj),
})
