import { Worker, Job } from 'bullmq'


export async function work() {
  console.log('waiting for jobs')
  const worker = new Worker('test', async (job: Job) => {
    console.log("got job")
    console.log(job.data.msg)
  },
  {
    connection: {
      host: 'localhost',
      port: 6379
    }
  })
}
