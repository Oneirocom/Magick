import { makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const split = makeInNOutFunctionDesc({
  name: 'logic/split/string',
  label: 'Split',
  in: [{ string: 'string' }, { seperator: 'string' }],
  out: [{ result: 'array' }],
  exec: (a: string, b: string) => {
    const regExp = new RegExp(b, 'g')
    const arr = a.split(regExp)
    console.log('ARR', arr)
    return arr
  },
})
