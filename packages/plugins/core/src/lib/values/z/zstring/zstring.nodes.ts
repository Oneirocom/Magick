import { makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { zString } from './zstring.primitive'

export const Constant = makeInNOutFunctionDesc({
  name: 'z/logic/string',
  label: 'String',
  in: ['string'],
  out: 'string',
  exec: (a: string) => zString.parse(a),
})

export const Concat = makeInNOutFunctionDesc({
  name: 'z/logic/concat/string',
  label: 'Concat',
  in: ['string', 'string'],
  out: 'string',
  exec: (a: string, b: string) => {
    const parsedA = zString.parse(a)
    const parsedB = zString.parse(b)
    return parsedA.concat(parsedB)
  },
})

export const Includes = makeInNOutFunctionDesc({
  name: 'z/logic/includes/string',
  label: 'Includes',
  in: ['string', 'string'],
  out: 'boolean',
  exec: (a: string, b: string) => {
    const parsedA = zString.parse(a)
    const parsedB = zString.parse(b)
    return parsedA.includes(parsedB)
  },
})

export const Length = makeInNOutFunctionDesc({
  name: 'z/logic/length/string',
  label: 'Length',
  in: ['string'],
  out: 'integer',
  exec: (a: string) => {
    const parsedA = zString.parse(a)
    return BigInt(parsedA.length)
  },
})

export const Equal = makeInNOutFunctionDesc({
  name: 'z/math/equal/string',
  label: '=',
  in: ['string', 'string'],
  out: 'boolean',
  exec: (a: string, b: string) => {
    const parsedA = zString.parse(a)
    const parsedB = zString.parse(b)
    return parsedA === parsedB
  },
})
