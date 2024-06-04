import { makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { zInteger } from './zinteger.primitive'

export const Constant = makeInNOutFunctionDesc({
  name: 'math/integer',
  label: 'Integer',
  in: ['integer'],
  out: 'integer',
  exec: (a: bigint) => zInteger.parse(a),
})

export const Add = makeInNOutFunctionDesc({
  name: 'math/add/integer',
  label: '+',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) + zInteger.parse(b),
})

export const Subtract = makeInNOutFunctionDesc({
  name: 'math/subtract/integer',
  label: '-',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) - zInteger.parse(b),
})

export const Negate = makeInNOutFunctionDesc({
  name: 'math/negate/integer',
  label: '-',
  in: ['integer'],
  out: 'integer',
  exec: (a: bigint) => -zInteger.parse(a),
})

export const Multiply = makeInNOutFunctionDesc({
  name: 'math/multiply/integer',
  label: '×',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) * zInteger.parse(b),
})

export const Divide = makeInNOutFunctionDesc({
  name: 'math/divide/integer',
  label: '÷',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) / zInteger.parse(b),
})

export const Modulus = makeInNOutFunctionDesc({
  name: 'math/modulus/integer',
  label: 'MOD',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) % zInteger.parse(b),
})

export const ToFloat = makeInNOutFunctionDesc({
  name: 'math/toFloat/integer',
  label: 'To Float',
  in: ['integer'],
  out: 'float',
  exec: (a: bigint) => Number(zInteger.parse(a)),
})

export const Min = makeInNOutFunctionDesc({
  name: 'math/min/integer',
  label: 'MIN',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) =>
    zInteger.parse(a) > zInteger.parse(b) ? zInteger.parse(b) : zInteger.parse(a),
})

export const Max = makeInNOutFunctionDesc({
  name: 'math/max/integer',
  label: 'MAX',
  in: ['integer', 'integer'],
  out: 'integer',
  exec: (a: bigint, b: bigint) =>
    zInteger.parse(a) > zInteger.parse(b) ? zInteger.parse(a) : zInteger.parse(b),
})

export const Clamp = makeInNOutFunctionDesc({
  name: 'math/clamp/integer',
  label: 'CLAMP',
  in: [{ value: 'integer' }, { min: 'integer' }, { max: 'integer' }],
  out: 'integer',
  exec: (value: bigint, min: bigint, max: bigint) => {
    const parsedValue = zInteger.parse(value)
    const parsedMin = zInteger.parse(min)
    const parsedMax = zInteger.parse(max)
    return parsedValue < parsedMin
      ? parsedMin
      : parsedValue > parsedMax
      ? parsedMax
      : parsedValue
  },
})

export const Abs = makeInNOutFunctionDesc({
  name: 'math/abs/integer',
  label: 'ABS',
  in: ['integer'],
  out: 'integer',
  exec: (a: bigint) => {
    const parsedA = zInteger.parse(a)
    return parsedA < BigInt(0) ? -parsedA : parsedA
  },
})

export const Sign = makeInNOutFunctionDesc({
  name: 'math/sign/integer',
  label: 'SIGN',
  in: ['integer'],
  out: 'integer',
  exec: (a: bigint) => {
    const parsedA = zInteger.parse(a)
    return parsedA < 0 ? BigInt(-1) : parsedA > 0 ? BigInt(1) : BigInt(0)
  },
})

export const Equal = makeInNOutFunctionDesc({
  name: 'math/equal/integer',
  label: '=',
  in: ['integer', 'integer'],
  out: 'boolean',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) === zInteger.parse(b),
})

export const GreaterThan = makeInNOutFunctionDesc({
  name: 'math/greaterThan/integer',
  label: '>',
  in: ['integer', 'integer'],
  out: 'boolean',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) > zInteger.parse(b),
})

export const GreaterThanOrEqual = makeInNOutFunctionDesc({
  name: 'math/greaterThanOrEqual/integer',
  label: '≥',
  in: ['integer', 'integer'],
  out: 'boolean',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) >= zInteger.parse(b),
})

export const LessThan = makeInNOutFunctionDesc({
  name: 'math/lessThan/integer',
  label: '<',
  in: ['integer', 'integer'],
  out: 'boolean',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) < zInteger.parse(b),
})

export const LessThanOrEqual = makeInNOutFunctionDesc({
  name: 'math/lessThanOrEqual/integer',
  label: '≤',
  in: ['integer', 'integer'],
  out: 'boolean',
  exec: (a: bigint, b: bigint) => zInteger.parse(a) <= zInteger.parse(b),
})

export const toBoolean = makeInNOutFunctionDesc({
  name: 'math/toBoolean/integer',
  label: 'To Boolean',
  in: ['integer'],
  out: 'boolean',
  exec: (a: bigint) => zInteger.parse(a) !== BigInt(0),
})
