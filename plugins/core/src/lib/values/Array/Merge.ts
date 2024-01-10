import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import { ArrayVariable } from './ArrayVariable'

export const arrayMerge = makeInNOutFunctionDesc({
  name: 'logic/array/merge',
  category: NodeCategory.Logic,
  label: 'Merge',
  in: [{ array1: 'array' }, { array2: 'array' }],
  out: 'array',
  exec: (arrayVariable: ArrayVariable<unknown>, arrayToSpread: unknown[]) => {
    // Spread the elements of arrayToSpread into arrayVariable.
    arrayVariable.push(...arrayToSpread)

    // Return the updated ArrayVariable.
    return arrayVariable
  },
})
