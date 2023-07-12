import { app, initApp } from '@magickml/server-core'
import { Reporter } from '.'
import { EventEmitter } from 'events'

export class FeathersSyncReporter implements Reporter {
    emitter: EventEmitter = new EventEmitter()

    constructor() {
        this.initReporter()
    }

    async initReporter(): Promise<void> {
        await initApp()
        app.service('agents').on('created', (agent: any) => {
            this.emitter.emit('agent:updated', agent)
        })
    }


    on(event: string, callback: (...args: any) => any): void {
        this.emitter.on(event, callback)
    }
}
