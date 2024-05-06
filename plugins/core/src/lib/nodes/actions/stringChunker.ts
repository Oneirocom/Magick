import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const stringChunker = makeFlowNodeDefinition({
  typeName: 'action/string/chunker',
  category: NodeCategory.Action,
  label: 'String Chunker',
  configuration: {
    chunkSize: {
      valueType: 'integer',
      defaultValue: 1,
    },
  },
  in: {
    flow: {
      valueType: 'flow',
    },
    content: {
      valueType: 'string',
    },
    chunkSize: {
      valueType: 'integer',
      defaultValue: 2,
    },
    delay: {
      valueType: 'integer',
      defaultValue: 100,
    },
  },
  out: {
    done: 'flow',
    stream: 'flow',
    chunk: 'string',
  },
  initialState: undefined,
  triggered: ({ read, write, commit }) => {
    const content = read('content') as string
    const chunkSize = Number(read('chunkSize')) as number
    const delay = Number(read('delay')) as number

    const chunks = [] as string[]
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize))
    }

    const emitChunk = (index: number) => {
      if (index < chunks.length) {
        write('chunk', chunks[index])

        commit('stream', async () => {
          await sleep(delay)
          emitChunk(index + 1)
        })
      } else {
        commit('done')
      }
    }

    emitChunk(0)
  },
})
