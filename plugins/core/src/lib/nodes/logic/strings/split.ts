import { makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const stringSplit = makeInNOutFunctionDesc({
  name: 'logic/split/string',
  label: 'String Split',
  in: [{ string: 'string' }, { seperator: 'string' }],
  out: [{ result: 'array' }],
  exec: (a: string, b: string) => {
    const regExp = new RegExp(b, 'g')
    const arr = a.split(regExp)
    return arr
  },
})
