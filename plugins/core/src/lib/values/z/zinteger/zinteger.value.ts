import { ValueType } from '@magickml/behave-graph'
import { zInteger } from './zinteger.primitive'

export const IntegerValue: ValueType = {
  name: 'integer',
  creator: () => BigInt(0),
  deserialize: (value: string | number): bigint => zInteger.parse(BigInt(value)),
  serialize: (value: bigint) =>
    zInteger.parse(value) &&
    Number.MIN_SAFE_INTEGER <= value &&
    value <= Number.MAX_SAFE_INTEGER
      ? Number(value)
      : value.toString(),
  lerp: (start: bigint, end: bigint, t: number) =>
    zInteger.parse(BigInt(Number(start) * (1 - t) + Number(end) * t)),
  equals: (a: bigint, b: bigint) => zInteger.parse(a) === zInteger.parse(b),
  clone: (value: bigint) => zInteger.parse(value),
}
