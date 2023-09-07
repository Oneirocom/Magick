type Connection = {
  type: string
  key: string
  task: Task
}

type Inputs = {
  [key: string]: Connection[]
}

type NextTask = {
  key: string
  task: Task
}

export class Task {
  inputs: Inputs
  component: any // Type should be refined based on usage
  worker: (task: Task, inputs: Inputs, data: any) => Promise<any>
  next: NextTask[]
  outputData: any | null
  closed: string[]

  constructor(
    inputs: Inputs,
    component: any,
    worker: typeof Task.prototype.worker
  ) {
    this.inputs = inputs
    this.component = component
    this.worker = worker
    this.next = []
    this.outputData = null
    this.closed = []

    this.getInputs('option').forEach(key => {
      this.inputs[key].forEach(con => {
        con.task.next.push({ key: con.key, task: this })
      })
    })
  }

  getInputs(type: string): string[] {
    return Object.keys(this.inputs)
      .filter(key => this.inputs[key][0])
      .filter(key => this.inputs[key][0].type === type)
  }

  reset(): void {
    this.outputData = null
  }

  async run(
    data: any,
    needReset = true,
    garbage: Task[] = [],
    propagate = true
  ): Promise<void> {
    if (needReset) garbage.push(this)

    if (!this.outputData) {
      const inputs: { [key: string]: any[] } = {}

      await Promise.all(
        this.getInputs('output').map(async key => {
          inputs[key] = await Promise.all(
            this.inputs[key].map(async con => {
              if (con) {
                await con.task.run(data, false, garbage, false)
                return con.task.outputData[con.key]
              }
            })
          )
        })
      )

      this.outputData = await this.worker(this, inputs, data)

      if (propagate)
        await Promise.all(
          this.next
            .filter(f => !this.closed.includes(f.key))
            .map(async f => await f.task.run(data, false, garbage))
        )
    }

    if (needReset) garbage.map(t => t.reset())
  }

  clone(root = true, oldTask?: Task, newTask?: Task): Task {
    const inputs = { ...this.inputs }

    if (root)
      // prevent of adding this task to `next` property of predecessor
      this.getInputs('option').map(key => delete inputs[key])
    // replace old tasks with new copies
    else
      Object.keys(inputs).forEach(key => {
        inputs[key] = inputs[key].map(con => ({
          ...con,
          task: con.task === oldTask ? newTask! : con.task,
        }))
      })

    const task = new Task(inputs, this.component, this.worker)

    // manually add copies of follow tasks
    task.next = this.next.map(n => ({
      key: n.key,
      task: n.task.clone(false, this, task),
    }))

    return task
  }
}
