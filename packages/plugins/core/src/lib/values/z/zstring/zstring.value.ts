import { ValueType } from '@magickml/behave-graph'
import { zString } from './zstring.primitive'

export const StringValue: ValueType = {
  name: 'string',
  creator: () => '',
  deserialize: (value: string) => zString.parse(value),
  serialize: (value: string) => zString.parse(value),
  lerp: (start: string, end: string, t: number) =>
    zString.parse(t < 0.5 ? start : end),
  equals: (a: string, b: string) => {
    const parsedA = zString.parse(a)
    const parsedB = zString.parse(b)
    return parsedA === parsedB
  },
  clone: (value: string) => zString.parse(value),
}
