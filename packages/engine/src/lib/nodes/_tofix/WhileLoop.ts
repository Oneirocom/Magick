// /* eslint-disable require-await */
// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import Rete from 'rete'

// import {
//   NodeData,
//   MagickNode,
//   MagickWorkerInputs,
//   MagickWorkerOutputs,
// } from '../../types'
// import { NumberControl } from '../../dataControls/NumberControl'
// import { triggerSocket } from '../../sockets'
// import { MagickComponent, MagickTask } from '../../types'

// const info = `While loop is used to execute a series of tasks for x times`

// type WorkerReturn = {
//   element?: number
// }
// export class WhileLoop extends MagickComponent<
//   Promise<WorkerReturn | undefined>
// > {
//   constructor() {
//     super('While Loop')
//     this.task = {
//       outputs: { true: 'option', element: 'output', false: 'option' },
//     }
//     this.category = 'Flow'
//     this.info = info
//   }

//   builder(node: MagickNode) {
//     const inp = new Rete.Input('act1', 'Data', triggerSocket, true)
//     const isTrue = new Rete.Output('true', 'Done', triggerSocket)
//     const isFalse = new Rete.Output('false', 'Loop', triggerSocket)

//     const recursionTimes = new NumberControl({
//       dataKey: 'recursionTimes',
//       name: 'Recursion Times',
//       icon: 'moon',
//     })

//     node.inspector.add(recursionTimes)

//     return node.addInput(inp).addOutput(isTrue).addOutput(isFalse)
//   }

//   async worker(
//     node: NodeData,
//     _inputs: MagickWorkerInputs,
//     _outputs: MagickWorkerOutputs,
//     { element }: { element: number }
//   ) {
//     const recursionTimesData = node?.data?.recursionTimes as string
//     const recursionTimes = recursionTimesData ? parseInt(recursionTimesData) : 0
//     const array: number[] = []
//     for (let i = 0; i < recursionTimes - (element ?? 0); i++) {
//       array.push(i + 1)
//     }

//     if (element === undefined) {
//       await Promise.all(
//         array.map((el: number) => {
//           if (el >= 2) {
//             return
//           }
//           this._task
//             .clone(false, {} as MagickTask, {} as MagickTask)
//             .run({ element: element !== undefined ? element + 1 : 1 })
//         })
//       )
//       this._task.closed = ['false']
//       return {}
//     } else {
//       this._task.closed = ['true']
//       return { element }
//     }
//   }
// }
