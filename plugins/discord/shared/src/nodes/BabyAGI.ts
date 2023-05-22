import Rete from 'rete'
import {
  MagickComponent,
  stringSocket,
  triggerSocket,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
  InputControl,
} from '@magickml/core'
import {
  addResults,
  addTask,
  createTasks,
  findSimilarSentences,
  listTasks,
  parseTasksToArray,
  popTask,
  taskCompletion,
  taskReprioritization,
} from './utils'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: Record<string, any>
}

/**
 * Baby AGI.
 * @category Discord
 * @remarks This will work only with text-davinci-003
 */
export class BabyAGI extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Baby AGI',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Experimental',
      'baby agi'
    )
  }
  /**
   * The builder function for the BabyAGI.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket)
    const promptInput = new Rete.Input('prompt', 'Prompt', stringSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)
    const noOfIterations = new InputControl({
      dataKey: 'iterations',
      name: 'Number of Iterations',
      icon: 'moon',
    })
    node.inspector.add(noOfIterations)
    return node
      .addInput(promptInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }
  /**
   * The worker function for the BabyAGI
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the tool.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const { app } = context.module
    const { agent } = context
    let n = (node?.data?.noOfIterations || 3) as number
    if (n < 0) n = 1
    let task_list = [{ task_id: 1, task: 'Make a todo list' }]
    const result_list = []
    const objective = inputs['prompt'][0] as unknown as string
    console.log('INPUT PROMPT', objective)
    //@ts-ignore
    let result
    // 3 Iterations roughly makes 9 calls to the API
    for (let index = 0; index < n; index++) {
      //Step 1: Pop the Task from task queue
      const task = popTask(task_list)
      //Step 2: Run the task with Addtional Context from previous results
      result = await taskCompletion(
        task.task,
        findSimilarSentences(result_list, task.task, 5).join(),
        objective,
        agent as any,
        app as any
      )
      addResults(result, task, result_list)
      //Step 3: Create new Tasks
      const new_tasks = createTasks(
        objective,
        task.task,
        parseTasksToArray(result as unknown as string).join(),
        listTasks(task_list).join(),
        agent as any,
        app as any
      )
      ;(await new_tasks).forEach(task => {
        addTask(task, task_list)
      })
      //Step 4: Reprioritize Tasks
      const updated_tasks = await taskReprioritization(
        task.task_id,
        objective,
        listTasks(task_list),
        agent as any,
        app as any
      )
      //Step 5: Update the task queue
      task_list = updated_tasks
    }
    console.log('RESULT')
    console.log(result_list)
    //@ts-ignore
    return { output: result }
  }
}
