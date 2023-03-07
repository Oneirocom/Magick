import Agent from './Agent'
import { app } from './app'

export class AgentManager {
  agents: { [id: string]: any } = {}
  lastAgents: any
  newAgents: any
  addHandlers: any = []
  removeHandlers: any = []

  constructor() {
    setInterval(async () => {
      await this.updateAgents()
    }, 1000)
  }

  registerAddAgentHandler(handler: Function) {
    this.addHandlers.push(handler)
  }

  registerRemoveAgentHandler(handler: Function) {
    this.removeHandlers.push(handler)
  }


  async updateAgents() {
    this.newAgents = (await app.service('agents').find()).data
    if (
      JSON.stringify(this.newAgents) === JSON.stringify(this.lastAgents ?? [])
    )
      return // They are the same
    console.log('Updating agents')

    // If an entry exists in lastAgents but not in newAgents, it has been deleted
    for (const i in this.lastAgents ?? []) {
      if (
        this.newAgents.filter((x: any) => x.id === this.lastAgents[i].id)[0] ===
        undefined
      ) {
        const id = this.lastAgents[i].id
        if(this.agents[id] !== undefined){
          const agent = this.agents[id]
          this.addHandlers.forEach((handler: Function) => handler(agent))
          await this.agents[id]?.onDestroy()
          this.agents[id] = null
          delete this.agents[id]
        }
      }
    }

    for (const i in this.newAgents) {
      if (
        this.lastAgents?.filter(
          (x: any) => x.id === this.lastAgents[i].id
        )[0] === undefined
      ) {
        const data = {
          ...this.newAgents[i],
          dirty: false,
          updatedAt: this.newAgents[i].updatedAt,
        }
        this.agents[data.id] = new Agent(data, this)
      }
    }

    this.lastAgents = this.newAgents
  }
}
