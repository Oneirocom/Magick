// import type { LoaderOptions } from '../../types'
// import { BaseLoader } from '@llm-tools/embedjs'
// import md5 from 'md5'

// export function defineLoader<T>(definition: LoaderDefinition<T>) {
//   return class extends BaseLoader {
//     private options: LoaderOptions
//     private input: T

//     constructor(input: T, options: LoaderOptions = {}) {
//       const uniqueId = `${definition.name}_${md5(JSON.stringify(input))}`
//       super(uniqueId, options.chunkSize as any, options.chunkOverlap)
//       this.input = input
//       this.options = options
//     }

//     async *getUnfilteredChunks() {
//       yield* definition.getUnfilteredChunks(this.input, this.options)
//     }

//     override async *getChunks() {
//       for await (const chunk of this.getUnfilteredChunks()) {
//         const processedChunk = definition.processChunk
//           ? definition.processChunk(chunk)
//           : {
//               ...chunk,
//               contentHash: md5(chunk.pageContent),
//             }
//         yield processedChunk
//       }
//     }
//   }
// }
