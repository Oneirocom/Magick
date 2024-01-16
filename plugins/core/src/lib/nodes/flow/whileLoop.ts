import { NodeCategory, makeAsyncNodeDefinition } from '@magickml/behave-graph'

const hardStop = 1000

export const whileLoop = makeAsyncNodeDefinition({
  typeName: 'flow/whileLoop',
  otherTypeNames: ['flow/while'],
  category: NodeCategory.Flow,
  label: 'While Loop',
  configuration: {
    maxIterations: {
      valueType: 'number',
      defaultValue: 10,
    },
  },
  in: {
    flow: {
      valueType: 'flow',
    },
    condition: {
      valueType: 'boolean',
      defaultValue: false,
    },
  },
  out: {
    completed: 'flow',
    loopBody: 'flow',
  },
  initialState: undefined,
  triggered: ({ configuration, finished = () => {}, commit, read }) => {
    const { maxIterations } = configuration
    const stop = maxIterations < hardStop ? maxIterations : hardStop

    const loopBodyIteration = (i: number) => {
      const condition = read('condition')
      if (i < stop && !condition) {
        commit('loopBody', async resolveSockets => {
          await resolveSockets()
          loopBodyIteration(i + 1)
        })
      } else {
        commit('completed')
        finished()
      }
    }
    loopBodyIteration(1)
  },
  dispose: () => {},
})
