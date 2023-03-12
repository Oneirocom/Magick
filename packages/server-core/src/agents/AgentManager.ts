import Agent from './Agent'
import { app } from '../app'
import _ from 'lodash'

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

  async deleteOldAgents() {
    for (const i in this.currentAgents) {
      // find any agentsin newAgents that have the save id as the current agent
      const newAgent = this.newAgents.find((agent) => agent.id === this.currentAgents[i].id)
      const oldAgent = this.currentAgents[i]
      if(!oldAgent) return;

      if(_.isEqual(oldAgent, newAgent)) {
        return
      }

      const id = oldAgent.id
      console.log('Agent has been updated, destroying old agent', id)

      const agent = this.agents[id]
      await agent.onDestroy()
      this.removeHandlers.forEach((handler) => handler({agent}))
      this.agents[id] = null
      delete this.currentAgents[i]
  }
  }

  async updateAgents() {
    this.newAgents = (await app.service('agents').find()).data
    // If an entry exists in currentAgents but not in newAgents, it has been deleted
    await this.deleteOldAgents()

    this.newAgents.forEach(async (agent: any) => {
      if(!agent.enabled) return  
      if(!agent.rootSpell) return

      // when was the agent last updated?
      const pingedAt = new Date(agent.pingedAt)

      // if it was updated less than 5 seconds ago, return
      if(((new Date().getTime() - pingedAt.getTime()) * 1000) < 5000)
        return console.log('Agent has been pinged recently', agent.id, new Date().getTime() - pingedAt.getTime())
      
      console.log('Agent is enabled and has not been pinged, starting', agent.id)

      const oldAgent = this.agents[agent.id]

      if(_.isEqual(oldAgent, agent)) {
        return
      }

      this.removeHandlers.forEach((handler) => handler({agent: oldAgent}))
      if(oldAgent)
        await oldAgent.onDestroy()
      // delete this.currentAgents value where id = agent.id
      this.currentAgents = this.currentAgents.filter((a) => a.id !== agent.id)
        
      const data = {
        ...agent,
        pingedAt: new Date().toISOString(),
      }
      this.agents[agent.id] = new Agent(data, this)
      this.currentAgents.push(agent)
      this.addHandlers.forEach((handler) => handler({agent: this.agents[agent.id], agentData: agent}))
    })
  }
}