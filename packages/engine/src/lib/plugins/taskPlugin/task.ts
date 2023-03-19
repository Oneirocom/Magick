import { NodeData, NodeDataOrEmpty } from 'rete/types/core/data'

import { MagickNode, MagickReteInput, MagickWorkerInputs } from '../../types'
import { MagickComponent, MagickTask } from '../../magick-component'

type TaskRef = {
  key: string
  task: MagickTask
  run?: (data: unknown, options: RunOptions) => void
  next?: TaskRef[]
}

export type TaskSocketInfo = {
  targetSocket: string | null,
  targetNode: NodeData | null,
}

export type TaskOptions = {
  outputs: Record<string, unknown>
  init?: (task:Task|undefined, node: MagickNode) => void
  onRun?: (node: NodeData, task: Task, data: unknown, socketInfo:TaskSocketInfo) => void
  runOneInput?: boolean
}

type RunOptions = {
  propagate?: boolean
  needReset?: boolean
  garbage?: Task[]
  fromSocket?: string
  fromNode?: NodeData
  fromTask?: Task
}

export type TaskOutputTypes = 'option' | 'output'

// const hasTrigger = (task: Task) => {
//   return Object.values(task.component.task.outputs).includes('option')
// }

// TODO: the TaskWorker should 
type TaskWorker = (_ctx: unknown, inputs: MagickWorkerInputs, data: NodeDataOrEmpty, socketInfo: TaskSocketInfo | string | null) => Promise<Record<string, unknown> | null>
// type TaskWorker = TaskWorker1 | TaskWorker2
export class Task {
  node: NodeData
  inputs: MagickWorkerInputs
  component: MagickComponent<unknown>
  worker: TaskWorker
  next: TaskRef[]
  outputData: Record<string, unknown> | null
  closed: string[]

  constructor(
    inputs: MagickWorkerInputs,
    component: MagickComponent<unknown>,
    node: NodeData,
    worker: TaskWorker
  ) {
    this.node = node
    this.inputs = inputs as MagickWorkerInputs
    this.component = component
    this.worker = worker
    this.next = []
    this.outputData = null
    this.closed = []

    this.getInputs('option').forEach((key: string) => {
      (this.inputs[key] as MagickReteInput[]).forEach(
        (workerInput: MagickReteInput) => {
          workerInput.task.next.push({ key: workerInput.key, task: this })
        }
      )
    })
  }
  x
  getInputs(type: TaskOutputTypes): string[] {
    return Object.keys(this.inputs)
      .filter(key => this.inputs[key][0])
      .filter(key => {
        const workerBase = this.inputs[key][0] as MagickReteInput
        return workerBase.type === type
      })
  }

  getInputFromConnection(socketKey: string) {
    let input: null | any = null
    Object.entries(this.inputs).forEach(([key, value]) => {
      if (
        (value as MagickReteInput[]).some(
          (con: MagickReteInput) => con && con.key === socketKey
        )
      ) {
        input = key
      }
    })

    return input
  }

  getInputByNodeId(node, fromSocket): string | null {
    let value: null | string = null
    Object.entries(this.inputs).forEach(([key, input]) => {
      const found = (input as MagickReteInput[]).find(
        (con: MagickReteInput) => con && con.task.node.id === node.id
      ) as {
        key: string
        task: { closed: string[] }
      }
      if (found) {
        if (found?.task && found.key == fromSocket) value = key
      }
    })

    return value
  }

  // getInputFromConnection(socketKey: string) {
  //   let input: null | any = null
  //   Object.entries(this.inputs).forEach(([key, value]) => {
  //     const val = value.find((con: any) => con && con.key === socketKey) as {
  //       task: { closed: string[] }
  //     }
  //     if (val) {
  //       if (val && val.task && val.task.closed.length > 0) {
  //         input = key
  //         return
  //       }
  //     }
  //   })

  //   return input
  // }

  reset() {
    this.outputData = null
    this.closed = []
  }

  async run(data: NodeDataOrEmpty = {}, options: RunOptions = {}) {
    const {
      needReset = true,
      garbage = [] as Task[],
      propagate = true,
      fromSocket,
      fromNode,
      // fromTask,
    } = options

    // garbage means that the nodes output value will be reset after it is all done.
    if (needReset) garbage.push(this)

    // This would be a great place to run an animation showing the signal flow.
    // Just needto figure out how to change the folow of the connection attached to a socket on the fly.
    // And animations should follow the flow of the data, not the main IO paths

    // Only run the worker if the outputData isnt already populated.
    if (!this.outputData) {
      const inputs = {} as Record<string, unknown[]>

      /*
        This is where we are populating all the input values to be passed into the worker. We are getting all the input connections that are connected as outputs (ie have values)
        We filter out all connections which did not come from the previou node.  This is to hgelp support multiple inputs properly, otherwise we actually back propagate along every input and run it, whichI think is unwanted behaviour.

        After we have filtered these out, we need to run the task, which triggers that nodes worker.  After the worker runs, the task has populated output data, which we take and we associate with the tasks input values, which are subsequently
        passed to the nodes worker for processing.

        We assume here that his nodes worker does not need to access ALL values simultaneously, but is only interested in one. There is a task option which enables this functionality just in case we have use cases that don't want this behaviour.
      */
      await Promise.all(
        this.getInputs('output').map(async key => {
          const inputPromises = (this.inputs[key] as MagickReteInput[])
            .filter((con: MagickReteInput) => {
              // only filter inputs to remove ones that are not the origin if a task option is true
              if (!this.component.task.runOneInput || !fromNode) return true
              if (con.task.outputData) return true
              if (con.task.node.id === fromNode.id) return true
              if (con.task.component.name === 'Spell') return false

              // return true if the input is from a triggerless component
              if (!con.task.node.outputs.trigger) return true
            })
            .map(async (con: MagickReteInput) => {
              // if the task has come from a node with output data that is not the calling node, use that data
              if (con.task.outputData && con.task.node.id !== fromNode?.id) {
                const outputData = con.task.outputData as Record<
                  string,
                  unknown
                >

                return outputData[con.key]
              }

              await con.task.run(data, {
                needReset: false,
                garbage,
                propagate: false,
                fromNode: this.node,
              })

              const outputData = con.task.outputData as unknown as Record<
                string,
                unknown
              >

              return outputData[con.key]
            })

          const magickWorkerinputs = await Promise.all(inputPromises)

          inputs[key] = magickWorkerinputs
        })
      )

      // socket info is used internally in the worker if we need to know about where signals come from.
      // this is mainly used currently by the module plugin to know where the run signal should go to.
      const socketInfo = {
        targetSocket: fromSocket
          ? this.getInputByNodeId(fromNode, fromSocket)
          : null,
        targetNode: fromNode ? fromNode : null,
      }

      // if (!socketInfo.targetSocket) debugger

      // the main output data of the task, which is gathered up when the next node gets this nodes value
      this.outputData = await this.worker(this, inputs, data, socketInfo)

      // an onRun option in case a task whats to do something when the task is run.
      if (this.component.task.onRun)
        this.component.task.onRun(this.node, this, data, socketInfo)

      // this is what propagates the the run command to the next nodes in the chain
      // this makes use of the 'next' nodes.  It also will filter out any connectios which the task has closed.
      // it is this functionality that lets us control which direction the run signal flows.
      if (propagate)
        await Promise.all(
          this.next
            .filter(con => !this.closed.includes(con.key))
            // pass the socket that is being calledikno
            .map(async con => {
              return await con.task.run(data, {
                needReset: false,
                garbage,
                fromSocket: con.key,
                fromNode: this.node,
                fromTask: this,
              })
            })
        )
    }

    if (needReset) garbage.map(t => t.reset())
  }

  clone(root = true, oldTask: MagickTask, newTask: MagickTask) {
    const inputs = Object.assign({}, this.inputs) as MagickWorkerInputs

    if (root)
      // prevent of adding this task to `next` property of predecessor
      this.getInputs('option').map(key => delete inputs[key])
    // replace old tasks with new copies
    else
      Object.keys(inputs).forEach((key: string) => {
        inputs[key] = (inputs[key] as MagickReteInput[]).map(
          (con: MagickReteInput) => ({
            ...con,
            task: con.task === oldTask ? newTask : (con.task as MagickTask),
          })
        )
      })

    const task = new Task(inputs, this.component, this.node, this.worker)

    // manually add a copies of follow tasks
    task.next = this.next.map(n => ({
      key: n.key,
      task: n.task.clone(false, this, task),
    }))

    return task
  }
}
