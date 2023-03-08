import Agent from './Agent'
import { app } from './app'

export class AgentManager {
  agents: { [id: string]: any } = {}
  currentAgents: any = []
  newAgents: any
  addHandlers: any = []
  removeHandlers: any = []

  getAgent({ agent }) {
    return this.agents[agent.id]
  }

  constructor() {
    setInterval(async () => {
      await this.updateAgents()
    }, 1000)
  }

  registerAddAgentHandler(handler) {
    this.addHandlers.push(handler)
  }

  registerRemoveAgentHandler(handler) {
    this.removeHandlers.push(handler)
  }


  async updateAgents() {
    this.newAgents = (await app.service('agents').find()).data
    if (
      JSON.stringify(this.newAgents) === JSON.stringify(this.currentAgents)
    )
      return // They are the same

    // If an entry exists in currentAgents but not in newAgents, it has been deleted
    for (const i in this.currentAgents ?? []) {
      if (
        this.newAgents.filter((x: any) => x.id === this.currentAgents[i].id)[0] === undefined
      ) {
        const id = this.currentAgents[i].id
        if(this.agents[id] !== undefined){
          const agent = this.agents[id]
          this.removeHandlers.forEach((handler) => handler({agent}))
          await this.agents[id]?.onDestroy()
          this.agents[id] = null
          delete this.agents[id]
          console.log('deleted agent', id)
        }
      }
    }

    this.newAgents.forEach(async (agent: any) => {
      if(!agent.enabled) return console.log('Agent is disabled', agent.id)      
      if(!agent.rootSpell) return console.log('Agent has no root spell', agent.id)
      
      const oldAgent = this.agents[agent.id]
      if(!oldAgent || !oldAgent.enabled || JSON.stringify(oldAgent) !== JSON.stringify(agent)){
        const data = {
          ...agent,
          dirty: false,
          updatedAt: new Date().toISOString(),
        }
        this.agents[data.id] = new Agent(data, this)
        this.addHandlers.forEach((handler) => handler({agent}))

        // tell the feathers 'agents' service to update the agent and set dirty to false
        await app.service('agents').patch(data.id, { dirty: false })
      }
    })

    this.currentAgents = this.newAgents
  }
}
