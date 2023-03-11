import Agent from './Agent'
import { app } from './app'

export class AgentManager {
  agents: { [id: string]: any } = {}
  currentAgents: any = []
  newAgents: any
  addHandlers: any = []
  removeHandlers: any = []

  getAgent({ agent }) {
    if(!agent) return
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
    // If an entry exists in currentAgents but not in newAgents, it has been deleted
    for (const i in this.currentAgents) {
        // find any agentsin newAgents that have the save id as the current agent
        const newAgent = this.newAgents.find((agent) => agent.id === this.currentAgents[i].id)
        if(!this.currentAgents[i]) return;
        const oldA = {...this.currentAgents[i], ...this.currentAgents[i]?.data}
        delete oldA.updatedAt

        const newA = {...newAgent, ...newAgent.data}
        delete newA.updatedAt

        // if the objects are the same, return
        if(JSON.stringify(oldA) === JSON.stringify(newA))
          return

        const id = this.currentAgents[i].id
        const agent = this.agents[id]
        console.log('agent', agent)
        await agent.onDestroy()
        this.removeHandlers.forEach((handler) => handler({agent}))
        this.agents[id] = null
        delete this.currentAgents[i]
        console.log('deleted agent', id)
    }

    this.newAgents.forEach(async (agent: any) => {
      if(!agent.enabled) return  
      if(!agent.rootSpell) return

      // when was the agent last updated?
      const updatedAt = new Date(agent.updatedAt)

      // if it was updated less than 5 seconds ago, return
      if(((new Date().getTime() - updatedAt.getTime()) * 1000) < 5000)
        return console.log('Agent has been pinged recently', agent.id, new Date().getTime() - updatedAt.getTime())
      
      console.log('Agent is enabled and has not been pinged, starting', agent.id)

      const oldAgent = this.agents[agent.id]

      const oldA = {...oldAgent, ...oldAgent?.data}
      delete oldA.updatedAt

      const newA = {...agent, ...agent.data}
      delete newA.updatedAt

      // if the objects are the same, return
      if(JSON.stringify(oldA) === JSON.stringify(newA))
        return

      console.log('Agent already exists, destroying', agent.id)
      this.removeHandlers.forEach((handler) => handler({agent: oldAgent}))
      if(oldAgent)
        await oldAgent.onDestroy()
      // delete this.currentAgents value where id = agent.id
      this.currentAgents = this.currentAgents.filter((a) => a.id !== agent.id)
      console.log('deleted agent', agent.id)
        
      const data = {
        ...agent,
        updatedAt: new Date().toISOString(),
      }
      this.agents[agent.id] = new Agent(data, this)
      this.currentAgents.push(agent)
      this.addHandlers.forEach((handler) => handler({agent: this.agents[agent.id], agentData: agent}))
      console.log('updated agent', data.id)
    })
  }
}
