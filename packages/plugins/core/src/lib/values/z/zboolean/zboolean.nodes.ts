import { makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { zBoolean } from './zboolean.primitive'

export const Constant = makeInNOutFunctionDesc({
  name: 'math/boolean',
  label: 'Boolean',
  in: ['boolean'],
  out: 'boolean',
  exec: (a: boolean) => zBoolean.parse(a),
})

export const And = makeInNOutFunctionDesc({
  name: 'math/and/boolean',
  label: '∧',
  in: ['boolean', 'boolean'],
  out: 'boolean',
  exec: (a: boolean, b: boolean) => zBoolean.parse(a) && zBoolean.parse(b),
})

export const Or = makeInNOutFunctionDesc({
  name: 'math/or/boolean',
  label: '∨',
  in: ['boolean', 'boolean'],
  out: 'boolean',
  exec: (a: boolean, b: boolean) => zBoolean.parse(a) || zBoolean.parse(b),
})

export const Not = makeInNOutFunctionDesc({
  name: 'math/negate/boolean',
  label: '¬',
  in: ['boolean'],
  out: 'boolean',
  exec: (a: boolean) => !zBoolean.parse(a),
})

export const ToFloat = makeInNOutFunctionDesc({
  name: 'math/toFloat/boolean',
  label: 'To Float',
  in: ['boolean'],
  out: 'float',
  exec: (a: boolean) => (zBoolean.parse(a) ? 1 : 0),
})

export const Equal = makeInNOutFunctionDesc({
  name: 'math/equal/boolean',
  label: '=',
  in: ['boolean', 'boolean'],
  out: 'boolean',
  exec: (a: boolean, b: boolean) => zBoolean.parse(a) === zBoolean.parse(b),
})

export const toInteger = makeInNOutFunctionDesc({
  name: 'math/toInteger/boolean',
  label: 'To Integer',
  in: ['boolean'],
  out: 'integer',
  //   exec: (a: boolean) => (zBoolean.parse(a) ? 1n : 0n),
  // TODO: BigInt(1) and BigInt(0) are not allowed with targets before ES2020
  exec: (a: boolean) => (zBoolean.parse(a) ? BigInt(1) : BigInt(0)),
})
