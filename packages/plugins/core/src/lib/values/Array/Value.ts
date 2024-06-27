import { ValueType } from '@magickml/behave-graph'
import { equals } from 'rambdax'
import { ArrayVariable } from './ArrayVariable'

export const ArrayValue: ValueType = {
  name: 'array',
  creator: () => new ArrayVariable(), // Create an empty ArrayVariable
  deserialize: (value: string | ArrayVariable<unknown>) =>
    typeof value === 'string' ? ArrayVariable.fromJSON<unknown>(value) : value,
  serialize: (value: ArrayVariable<unknown>) => JSON.stringify(value),
  lerp: (
    start: ArrayVariable<unknown>,
    end: ArrayVariable<unknown>,
    t: number
  ) => {
    // Implement lerp logic for ArrayVariable. Here's a simple example:
    return t < 0.5 ? start : end
  },
  equals: (a: ArrayVariable<unknown>, b: ArrayVariable<unknown>) => {
    // Check if arrays are equal, including their keys
    if (a.length !== b.length || a.key !== b.key) {
      return false
    }
    for (let i = 0; i < a.length; ++i) {
      if (!equals(a[i], b[i])) {
        return false
      }
    }
    return true
  },
  clone: (value: ArrayVariable<unknown>) => {
    // Clone the ArrayVariable, including its key
    return new ArrayVariable([...value], value.key)
  },
}

// export const ArrayValue: ValueType = {
//   name: 'array',
//   creator: () => [],
//   deserialize: (value: string | unknown[]) =>
//     typeof value === 'string' ? JSON.parse(value) : value,
//   serialize: (value: unknown[]) => JSON.stringify(value),
//   lerp: (start: unknown[], end: unknown[], t: number) => {
//     if (t < 0.5) {
//       return start
//     } else {
//       return end
//     }
//   },
//   equals: (a: unknown[], b: unknown[]) => {
//     if (a.length !== b.length) {
//       return false
//     }
//     for (let i = 0; i < a.length; ++i) {
//       if (!equals(a[i], b[i])) {
//         return false
//       }
//     }
//     return true
//   },
//   clone: (value: unknown[]) => [...value],
// }
