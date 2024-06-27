import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { ArrayVariable } from './ArrayVariable' // Assuming this is the path to your ArrayVariable class

type ArrayOrArrayVariable<T> = ArrayVariable<T> | T[]

function customConcat<T>(
  ...arrays: ArrayOrArrayVariable<T>[]
): ArrayVariable<T> {
  // Check if the first array is an ArrayVariable to decide the key
  const key = arrays[0] instanceof ArrayVariable ? arrays[0].key : undefined

  // Create a new ArrayVariable with the correct constructor signature
  const concatenated = new ArrayVariable<T>([], key)

  // Concatenate all arrays into the new ArrayVariable
  arrays.forEach(array => {
    if (array instanceof ArrayVariable) {
      concatenated.push(...array)
    } else {
      // If it's a standard array, just spread its elements into the ArrayVariable
      concatenated.push(...array)
    }
  })

  return concatenated
}

export const Concat = makeInNOutFunctionDesc({
  name: 'logic/concat/array/2',
  aliases: ['logic/concat/array'],
  category: NodeCategory.Logic,
  label: 'Concat',
  in: ['array', 'array'],
  out: 'array',
  exec: (
    a: ArrayVariable<unknown> | unknown[],
    b: ArrayVariable<unknown> | unknown[]
  ) => customConcat(a, b),
})

export const Concat3 = makeInNOutFunctionDesc({
  name: 'logic/concat/array/3',
  category: NodeCategory.Logic,
  label: 'Concat',
  in: ['array', 'array', 'array'],
  out: 'array',
  exec: (
    a: ArrayVariable<unknown> | unknown[],
    b: ArrayVariable<unknown> | unknown[],
    c: ArrayVariable<unknown> | unknown[]
  ) => customConcat(a, b, c),
})
