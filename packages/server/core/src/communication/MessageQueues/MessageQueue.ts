import { AgentJob } from 'server/agents'
import EventEmitter from 'events'

export interface MessageQueue {
  addJob(jobType: string, job: AgentJob, jobId?: string): Promise<void>

  initialize(queueName: string): void
}

export interface MessageWorker extends EventEmitter {}

export interface Job<T> {
  id?: string
  data: T
}
