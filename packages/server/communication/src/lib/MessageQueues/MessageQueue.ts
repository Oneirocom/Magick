import EventEmitter from 'events'

export interface MessageQueue {
  addJob<JobData = any>(
    jobType: string,
    job: JobData,
    jobId?: string
  ): Promise<void>

  initialize(queueName: string): void
  close(): Promise<void>
}

export interface MessageWorker extends EventEmitter {}

export interface Job<T> {
  id?: string
  data: T
}
