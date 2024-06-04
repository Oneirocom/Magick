import { ValueType } from '@magickml/behave-graph'
import { zBoolean } from './zboolean.primitive'

export const BooleanValue: ValueType = {
  name: 'boolean',
  creator: () => false,
  deserialize: (value: string | boolean) =>
    typeof value === 'string'
      ? zBoolean.parse(value.toLowerCase() === 'true')
      : zBoolean.parse(value),
  serialize: (value: boolean) => zBoolean.parse(value),
  lerp: (start: boolean, end: boolean, t: number) =>
    zBoolean.parse(t < 0.5 ? start : end),
  equals: (a: boolean, b: boolean) => zBoolean.parse(a) === zBoolean.parse(b),
  clone: (value: boolean) => zBoolean.parse(value),
}
