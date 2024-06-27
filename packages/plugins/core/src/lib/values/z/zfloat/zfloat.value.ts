import { ValueType, parseSafeFloat } from '@magickml/behave-graph'
import { zFloat } from './zfloat.primitive'

export const FloatValue: ValueType = {
  name: 'float',
  creator: () => 0,
  deserialize: (value: string | number) =>
    typeof value === 'string' ? parseSafeFloat(value, 0) : zFloat.parse(value),
  serialize: (value: number) => zFloat.parse(value),
  lerp: (start: number, end: number, t: number) =>
    zFloat.parse(start) * (1 - t) + zFloat.parse(end) * t,
  equals: (a: number, b: number) => zFloat.parse(a) === zFloat.parse(b),
  clone: (value: number) => zFloat.parse(value),
}
