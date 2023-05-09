// DOCUMENTED
import { API_ROOT_URL, DEFAULT_USER_TOKEN, PRODUCTION } from '@magickml/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from '@magickml/client-core'
import TaskTable from './TaskTable'

/**
 * Defines the properties of an task.
 */
interface Task {
  // Add properties of the task
  name: string
  location: string
}

/**
 * TaskWindow component displays the tasks of a project.
 * @returns JSX Element
 */
const TaskWindow = (): JSX.Element => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [tasks, setTasks] = useState<Task[] | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  /**
   * Resets the tasks and fetches the updated tasks.
   */
  const resetTasks = async (): Promise<void> => {
    await fetchTasks()
  }

  /**
   * Fetches the tasks of the current project.
   */
  const fetchTasks = async (): Promise<void> => {
    try {
      const headers = PRODUCTION
        ? { Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }

      const response = await fetch(
        `${API_ROOT_URL}/tasks?projectId=${config.projectId}`,
        {
          headers: headers as any, // TODO: look at this
        }
      )

      console.log('tasks', response)

      const data = await response.json()
      console.log('data', data)
      setTasks(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className="task-container"
      style={{
        paddingBottom: '1em',
        width: '100%',
        height: '100vh',
        overflow: 'scroll',
      }}
    >
      {tasks && <TaskTable tasks={tasks} updateCallback={resetTasks} />}
    </div>
  )
}

export default TaskWindow
