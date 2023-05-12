import { app } from '@magickml/server-core'
import { Reporter } from '../Reporter'
import { EventEmitter } from 'events'

export class FeathersSyncReporter implements Reporter {
    emitter: EventEmitter = new EventEmitter()

    constructor() {
        app.service('agents').on('created', (agent: any) => {
            this.emitter.emit('new-agent', agent)
        })
    }

    on(event: string, callback: (...args: any) => any): void {
        this.emitter.on(event, callback)
    }
}
