export abstract class Worker {
    constructor() {}

    initialize(queueName: string, callback: (job: any) => Promise<any>): void {}
}

export * from './BullMQ';
