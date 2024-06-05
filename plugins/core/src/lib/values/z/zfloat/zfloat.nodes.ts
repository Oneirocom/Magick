import {
  degreesToRadians,
  equalsTolerance,
  makeInNOutFunctionDesc,
  radiansToDegrees,
} from '@magickml/behave-graph'
import { zFloat } from './zfloat.primitive'

export const Constant = makeInNOutFunctionDesc({
  name: 'math/float',
  label: 'Float',
  in: ['float'],
  out: 'float',
  exec: (a: number) => zFloat.parse(a),
})

export const Add = makeInNOutFunctionDesc({
  name: 'math/add/float',
  label: '+',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => zFloat.parse(a) + zFloat.parse(b),
})

export const Subtract = makeInNOutFunctionDesc({
  name: 'math/subtract/float',
  label: '-',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => zFloat.parse(a) - zFloat.parse(b),
})

export const Negate = makeInNOutFunctionDesc({
  name: 'math/negate/float',
  label: '-',
  in: ['float'],
  out: 'float',
  exec: (a: number) => -zFloat.parse(a),
})

export const Multiply = makeInNOutFunctionDesc({
  name: 'math/multiply/float',
  label: '×',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => zFloat.parse(a) * zFloat.parse(b),
})

export const Divide = makeInNOutFunctionDesc({
  name: 'math/divide/float',
  label: '÷',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => zFloat.parse(a) / zFloat.parse(b),
})

export const Modulus = makeInNOutFunctionDesc({
  name: 'math/modulus/float',
  label: 'MOD',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => zFloat.parse(a) % zFloat.parse(b),
})

export const Power = makeInNOutFunctionDesc({
  name: 'math/pow/float',
  label: 'POW',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => Math.pow(zFloat.parse(a), zFloat.parse(b)),
})

export const SquareRoot = makeInNOutFunctionDesc({
  name: 'math/sqrt/float',
  label: '√',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.sqrt(zFloat.parse(a)),
})

export const E = makeInNOutFunctionDesc({
  name: 'math/e/float',
  label: '𝑒',
  out: 'float',
  exec: () => Math.E,
})

export const Exp = makeInNOutFunctionDesc({
  name: 'math/exp/float',
  label: 'EXP',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.exp(zFloat.parse(a)),
})

export const Ln = makeInNOutFunctionDesc({
  name: 'math/ln/float',
  label: 'LN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.log(zFloat.parse(a)),
})

export const Log2 = makeInNOutFunctionDesc({
  name: 'math/log2/float',
  label: 'LOG2',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.log2(zFloat.parse(a)),
})

export const Log10 = makeInNOutFunctionDesc({
  name: 'math/log10/float',
  label: 'LOG10',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.log10(zFloat.parse(a)),
})

export const PI = makeInNOutFunctionDesc({
  name: 'math/pi/float',
  label: 'π',
  out: 'float',
  exec: () => Math.PI,
})

export const Sin = makeInNOutFunctionDesc({
  name: 'math/sin/float',
  label: 'SIN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.sin(zFloat.parse(a)),
})

export const Asin = makeInNOutFunctionDesc({
  name: 'math/asin/float',
  label: 'ASIN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.asin(zFloat.parse(a)),
})

export const Cos = makeInNOutFunctionDesc({
  name: 'math/cos/float',
  label: 'COS',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.cos(zFloat.parse(a)),
})

export const Acos = makeInNOutFunctionDesc({
  name: 'math/acos/float',
  label: 'ACOS',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.acos(zFloat.parse(a)),
})

export const Tan = makeInNOutFunctionDesc({
  name: 'math/tan/float',
  label: 'TAN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.tan(zFloat.parse(a)),
})

export const RadiansToDegrees = makeInNOutFunctionDesc({
  name: 'math/radiansToDegrees/float',
  label: 'To Degrees',
  in: ['float'],
  out: 'float',
  exec: (a: number) => radiansToDegrees(zFloat.parse(a)),
})

export const DegreesToRadians = makeInNOutFunctionDesc({
  name: 'math/degreesToRadians/float',
  label: 'To Radians',
  in: ['float'],
  out: 'float',
  exec: (a: number) => degreesToRadians(zFloat.parse(a)),
})

export const Atan = makeInNOutFunctionDesc({
  name: 'math/atan/float',
  label: 'ATAN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.atan(zFloat.parse(a)),
})

export const Mix = makeInNOutFunctionDesc({
  name: 'math/mix/float',
  label: 'MIX',
  in: ['float', 'float', 'float'],
  out: 'float',
  exec: (a: number, b: number, t: number) => {
    const parsedA = zFloat.parse(a)
    const parsedB = zFloat.parse(b)
    const parsedT = zFloat.parse(t)
    const s = 1 - parsedT
    return parsedA * s + parsedB * parsedT
  },
})

export const ToFloat = makeInNOutFunctionDesc({
  name: 'math/toFloat/float',
  label: 'To Float',
  in: ['float'],
  out: 'float',
  exec: (a: number) => zFloat.parse(a),
})

export const Min = makeInNOutFunctionDesc({
  name: 'math/min/float',
  label: 'MIN',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => Math.min(zFloat.parse(a), zFloat.parse(b)),
})

export const Max = makeInNOutFunctionDesc({
  name: 'math/max/float',
  label: 'MAX',
  in: ['float', 'float'],
  out: 'float',
  exec: (a: number, b: number) => Math.max(zFloat.parse(a), zFloat.parse(b)),
})

export const Clamp = makeInNOutFunctionDesc({
  name: 'math/clamp/float',
  label: 'CLAMP',
  in: ['float', 'float', 'float'],
  out: 'float',
  exec: (value: number, min: number, max: number) => {
    const parsedValue = zFloat.parse(value)
    const parsedMin = zFloat.parse(min)
    const parsedMax = zFloat.parse(max)
    return parsedValue < parsedMin
      ? parsedMin
      : parsedValue > parsedMax
      ? parsedMax
      : parsedValue
  },
})

export const Abs = makeInNOutFunctionDesc({
  name: 'math/abs/float',
  label: 'ABS',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.abs(zFloat.parse(a)),
})

export const Sign = makeInNOutFunctionDesc({
  name: 'math/sign/float',
  label: 'SIGN',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.sign(zFloat.parse(a)),
})

export const Floor = makeInNOutFunctionDesc({
  name: 'math/floor/float',
  label: 'FLOOR',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.floor(zFloat.parse(a)),
})

export const Ceil = makeInNOutFunctionDesc({
  name: 'math/ceil/float',
  label: 'CEIL',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.ceil(zFloat.parse(a)),
})

export const Round = makeInNOutFunctionDesc({
  name: 'math/round/float',
  label: 'ROUND',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.round(zFloat.parse(a)),
})

export const Trunc = makeInNOutFunctionDesc({
  name: 'math/trunc/float',
  label: 'TRUNC',
  in: ['float'],
  out: 'float',
  exec: (a: number) => Math.trunc(zFloat.parse(a)),
})

export const Random = makeInNOutFunctionDesc({
  name: 'math/random/float',
  label: 'RANDOM',
  out: 'float',
  exec: Math.random,
})

export const Equal = makeInNOutFunctionDesc({
  name: 'math/equal/float',
  label: '=',
  in: ['float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number) => zFloat.parse(a) === zFloat.parse(b),
})

export const EqualTolerance = makeInNOutFunctionDesc({
  name: 'math/equalTolerance/float',
  label: '=',
  in: ['float', 'float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number, tolerance: number) =>
    equalsTolerance(zFloat.parse(a), zFloat.parse(b), zFloat.parse(tolerance)),
})

export const GreaterThan = makeInNOutFunctionDesc({
  name: 'math/greaterThan/float',
  label: '>',
  in: ['float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number) => zFloat.parse(a) > zFloat.parse(b),
})

export const GreaterThanOrEqual = makeInNOutFunctionDesc({
  name: 'math/greaterThanOrEqual/float',
  label: '≥',
  in: ['float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number) => zFloat.parse(a) >= zFloat.parse(b),
})

export const LessThan = makeInNOutFunctionDesc({
  name: 'math/lessThan/float',
  label: '<',
  in: ['float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number) => zFloat.parse(a) < zFloat.parse(b),
})

export const LessThanOrEqual = makeInNOutFunctionDesc({
  name: 'math/lessThanOrEqual/float',
  label: '≤',
  in: ['float', 'float'],
  out: 'boolean',
  exec: (a: number, b: number) => zFloat.parse(a) <= zFloat.parse(b),
})

export const IsNaN = makeInNOutFunctionDesc({
  name: 'math/isNaN/float',
  label: 'isNaN',
  in: ['float'],
  out: 'boolean',
  exec: (a: number) => Number.isNaN(zFloat.parse(a)),
})

export const IsInf = makeInNOutFunctionDesc({
  name: 'math/isInf/float',
  label: 'isInf',
  in: ['float'],
  out: 'boolean',
  exec: (a: number) =>
    !Number.isFinite(zFloat.parse(a)) && !Number.isNaN(zFloat.parse(a)),
})
