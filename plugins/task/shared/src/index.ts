// DOCUMENTED
/**
 * This is the main file exporting the nodes used in the app
 */

import { MagickComponent } from '@magickml/core'
import { TaskInput } from './nodes/TaskInput'
import { CancelTask } from './nodes/CancelTask'
import { CompleteTask } from './nodes/CompleteTask'
import { CreateTask } from './nodes/CreateTask'
import { FinishTaskStep } from './nodes/FinishTaskStep'

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): typeof MagickComponent<any>[] {
  return [
    CancelTask,
    TaskInput,
    CompleteTask,
    CreateTask,
    FinishTaskStep
  ]
}
