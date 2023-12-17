import { ValueType } from '@magickml/behave-graph'
import { equals } from 'rambdax'

// export const ListValue = new ValueType(
//   'list',
//   () => [],
//   (value: string | unknown[]) =>
//     typeof value === 'string' ? JSON.parse(value) : value,
//   (value: unknown[]) => JSON.stringify(value),
//   (value: unknown[]) => {
//     throw new Error('Not implemented');
//   }
// );

// rewrite list value in new format
export const ArrayValue: ValueType = {
  name: 'array',
  creator: () => [],
  deserialize: (value: string | unknown[]) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  serialize: (value: unknown[]) => JSON.stringify(value),
  lerp: (start: unknown[], end: unknown[], t: number) => {
    if (t < 0.5) {
      return start
    } else {
      return end
    }
  },
  equals: (a: unknown[], b: unknown[]) => {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; ++i) {
      if (!equals(a[i], b[i])) {
        return false
      }
    }
    return true
  },
  clone: (value: unknown[]) => [...value],
}
