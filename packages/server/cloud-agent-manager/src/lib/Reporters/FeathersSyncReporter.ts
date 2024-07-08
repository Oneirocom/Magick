import { AGENT_DELETE } from '@magickml/agent-communication'
import { getLogger } from '@magickml/server-logger'
import { app } from '@magickml/agent-server'
import { Reporter } from '.'
import { EventEmitter } from 'events'

export class FeathersSyncReporter implements Reporter {
  emitter: EventEmitter = new EventEmitter()
  logger = getLogger()

  constructor() {
    this.initReporter()
  }

  async initReporter(): Promise<void> {
    this.logger.info('Initializing FeathersSyncReporter...')
    app.service('agents').on('patched', (agent: any) => {
      this.emitter.emit('agent:updated', agent)
      this.emitter.emit(`agent:updated:${agent.id}`, agent)
    })
    app
      .service('agents')
      .on('deleted', (agent: any) => this.emitter.emit(AGENT_DELETE, agent))
    this.logger.info('FeathersSyncReporter initialized')
  }

  on(event: string, callback: (...args: any) => any): void {
    this.emitter.on(event, callback)
  }
}
