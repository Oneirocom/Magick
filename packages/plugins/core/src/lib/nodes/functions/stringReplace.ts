import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const stringReplace = makeInNOutFunctionDesc({
  name: 'logic/string/replace',
  aliases: ['logic/replace/string'],
  category: NodeCategory.Logic,
  label: 'Replace',
  in: [{ string: 'string' }, { search: 'string' }, { replace: 'string' }],
  out: [{ result: 'string' }],
  exec: (string: string, search: string, replace: string) => {
    return string.replace(search, replace)
  },
})
