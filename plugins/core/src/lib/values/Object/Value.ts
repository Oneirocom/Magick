import { ValueType } from '@magickml/behave-graph'
import { equals } from 'rambdax'

// export const ObjectValue = new ValueType(
//   'object',
//   () => [],
//   (value: string | object) =>
//     typeof value === 'string' ? JSON.parse(value) : value,
//   (value: object) => JSON.stringify(value),
//   (value: object) => {
//     throw new Error('Not implemented');
//   }
// );

// rewrite object value in new formattaking into account we are manipulating objects
export const ObjectValue: ValueType = {
  name: 'object',
  creator: () => [],
  deserialize: (value: string | object) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  serialize: (value: object) => JSON.stringify(value),
  lerp: (start: object, end: object, t: number) => {
    if (t < 0.5) {
      return start
    } else {
      return end
    }
  },
  // implemene equals for objects
  equals: (a: object, b: object) => {
    return equals(a, b)
  },
  clone: (value: object) => ({ ...value }),
}
