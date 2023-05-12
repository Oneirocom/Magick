import { feathers, Application } from '@feathersjs/feathers'
import sync from 'feathers-sync'
import { parse, stringify } from 'flatted'
import { Reporter } from '../Reporter'
import { app } from '@magickml/server-core'

export class FeathersSyncReporter implements Reporter {
    constructor() {
        app.service('agents').on('created', (agent: any) => {
            console.log('Agent created', agent)
        })
    }

    async on(agentId: string, callback: (state: string) => Promise<void>) {
        console.log(`Agent ${agentId} changed state`)
    }
}
