export abstract class Worker {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(queueName: string, callback: (job: any) => Promise<any>): void {}
}
