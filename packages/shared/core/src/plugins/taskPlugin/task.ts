import { NodeData } from '@magickml/rete'

import { MagickReteInput, MagickWorkerInputs } from '../../types'
import { MagickComponent } from '../../engine'

type TaskRef = {
  key: string
  nodeId: number
}

export type TaskSocketInfo = {
  targetSocket: string | null
  targetNode: number | null
}

export type TaskOptions = {
  outputs: Record<string, unknown>
  init?: (task: Task | undefined, node: NodeData) => void
  onRun?: (
    node: NodeData,
    task: Task,
    data: unknown,
    socketInfo: TaskSocketInfo
  ) => void
  runOneInput?: boolean
}

type RunOptions = {
  propagate?: boolean
  needReset?: boolean
  garbage?: Task[]
  fromSocket?: string
  fromNodeId?: number
  fromTask?: Task
}

export type TaskOutputTypes = 'option' | 'output'

export type TaskStore = Record<string, Task>

type TaskWorker = (
  _ctx: unknown,
  inputs: MagickWorkerInputs,
  data: NodeData,
  socketInfo: TaskSocketInfo | string | null
) => Promise<Record<string, unknown> | null>
export class Task {
  nodeId: number
  inputs: MagickWorkerInputs
  component: MagickComponent<unknown>
  worker: TaskWorker
  next: TaskRef[]
  outputData: Record<string, unknown> | null
  closed: string[]
  getTask: (nodeId: number) => Task

  constructor(
    inputs: MagickWorkerInputs,
    component: MagickComponent<unknown>,
    nodeId: number,
    worker: TaskWorker,
    getTask: (nodeId: number) => Task
  ) {
    this.inputs = inputs as MagickWorkerInputs
    this.component = component
    this.worker = worker
    this.next = []
    this.outputData = null
    this.closed = []
    this.nodeId = nodeId
    this.getTask = getTask
    this.initializeNextTasks()
  }

  private initializeNextTasks() {
    this.getInputs('option').forEach((key: string) => {
      ;(this.inputs[key] as MagickReteInput[]).forEach(
        (workerInput: MagickReteInput) => {
          const task = this.getTask(workerInput.nodeId)
          task.next.push({
            key: workerInput.key,
            nodeId: this.nodeId,
          })
        }
      )
    })
  }

  getInputs(type: TaskOutputTypes): string[] {
    return Object.keys(this.inputs)
      .filter(key => this.inputs[key][0])
      .filter(key => {
        const workerBase = this.inputs[key][0] as MagickReteInput
        return workerBase.type === type
      })
  }

  getInputFromConnection(socketKey: string) {
    let input: null | string = null
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

  getInputByNodeId(nodeId, fromSocket): string | null {
    let value: null | string = null
    Object.entries(this.inputs).forEach(([key, input]) => {
      const found = input.find(
        (con: any) => con && con.nodeId === nodeId
      ) as any

      if (found) {
        if (found.key === fromSocket) value = key
      }
    })

    return value
  }

  private filterOutputConnections(con, fromNodeId: number | undefined) {
    const task = this.getTask(con.nodeId)
    if (this.component.task.runOneInput && fromNodeId) {
      if (task.nodeId === fromNodeId) return true
      if (task.outputData) return true
      return false
    }
    // if (task.outputData) return true
    // if (task.nodeId === fromNodeId) return true
    // if (task.component.name === 'Spell') return false

    // return true if the input is from a triggerless component
    // if (!task.node.outputs.trigger) return true
    // TODO: check if default should be false
    return true
  }

  reset() {
    this.outputData = null
    this.closed = []
  }

  async run(data: NodeData, options: RunOptions = {}) {
    const {
      needReset = true,
      garbage = [] as Task[],
      propagate = true,
      fromSocket,
      fromNodeId,
      // fromTask,z
    } = options

    // garbage means that the nodes output value will be reset after it is all done.
    if (needReset) garbage.push(this)

    // Only run the worker if the outputData isnt already populated.
    if (!this.outputData) {
      const inputs = {} as Record<string, unknown[]>

      await Promise.all(
        this.getInputs('output').map(async key => {
          const inputPromises = (this.inputs[key] as MagickReteInput[])
            .filter(con => {
              return this.filterOutputConnections.call(this, con, fromNodeId)
            })
            .map(async (con: MagickReteInput) => {
              const task = this.getTask(con.nodeId)
              // if the task has come from a node with output data that is not the calling node, use that data
              if (task.outputData && task.nodeId !== fromNodeId) {
                return (task.outputData as Record<string, unknown>)[con.key]
              }

              await task.run(data, {
                needReset: false,
                garbage,
                propagate: false,
                fromNodeId: this.nodeId,
              })

              return (task.outputData as Record<string, unknown>)[con.key]
            })

          const magickWorkerinputs = await Promise.all(inputPromises)

          inputs[key] = magickWorkerinputs
        })
      )

      // socket info is used internally in the worker if we need to know about where signals come from.
      // this is mainly used currently by the module plugin to know where the run signal should go to.
      const socketInfo = {
        targetSocket: fromSocket
          ? this.getInputByNodeId(fromNodeId, fromSocket)
          : null,
        targetNode: fromNodeId ? fromNodeId : null,
      }

      // the main output data of the task, which is gathered up when the next node gets this nodes value
      this.outputData = await this.worker(this, inputs, data, socketInfo)

      if (propagate) await this.propagateRun(data, garbage)
    }

    if (needReset) garbage.map(t => t.reset())
  }

  private async propagateRun(data, garbage) {
    await Promise.all(
      this.next
        .filter(con => {
          return !this.closed.includes(con.key)
        })
        // pass the socket that is being calledikno
        .map(async con => {
          const task = this.getTask(con.nodeId)
          return await task.run(data, {
            needReset: false,
            garbage,
            fromSocket: con.key,
            fromNodeId: this.nodeId,
            fromTask: this,
          })
        })
    )
  }

  clone(root = true, oldTask: Task, newTask: Task) {
    const inputs = Object.assign({}, this.inputs) as MagickWorkerInputs

    if (root)
      // prevent of adding this task to `next` property of predecessor
      this.getInputs('option').map(key => delete inputs[key])
    // replace old tasks with new copies
    else
      Object.keys(inputs).forEach((key: string) => {
        inputs[key] = (inputs[key] as MagickReteInput[]).map(
          (con: MagickReteInput) => {
            const task = this.getTask(con.nodeId)
            return {
              ...con,
              task: task === oldTask ? newTask : (task as Task),
            }
          }
        )
      })

    // todo this may cause issues if we need a whole new copy of the node it references
    // right now it is just a reference to the node
    const task = new Task(
      inputs,
      this.component,
      this.nodeId,
      this.worker,
      this.getTask
    )

    // manually add a copies of follow tasks
    task.next = this.next.map(n => ({
      key: n.key,
      nodeId: n.nodeId,
    }))

    return {}
  }
}
