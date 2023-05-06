// DOCUMENTED
import Agent from './Agent'
import _ from 'lodash'

/**
 * Class for managing agents.
 */
export class AgentManager {
  agents: { [id: string]: any } = {}
  currentAgents: any = []
  newAgents: any
  addHandlers: any = []
  removeHandlers: any = []
  app: any
  /**
   * Get the agent with the given agent data.
   * @param agent - The agent data.
   * @returns The agent if found.
   */
  getAgent({ agent }) {
    if (!agent) return
    return this.agents[agent.id]
  }

  /**
   * Create an agent manager.
   */
  constructor(app) {
    this.app = app
    // Update agents every second
    setInterval(async () => {
      console.log('Updating agents')
      await this.updateAgents()
    }, 1000)
  }

  /**
   * Register a handler to be called when an agent is added.
   * @param handler - The handler function to be called.
   */
  registerAddAgentHandler(handler) {
    this.addHandlers.push(handler)
  }

  /**
   * Register a handler to be called when an agent is removed.
   * @param handler - The handler function to be called.
   */
  registerRemoveAgentHandler(handler) {
    this.removeHandlers.push(handler)
  }

  /**
   * Delete old agent instances.
   */
  async deleteOldAgents() {
    for (const i in this.currentAgents) {
      const newAgent = this.newAgents.find(
        agent => agent.id === this.currentAgents[i].id
      )
      const oldAgent = this.currentAgents[i]

      if (!oldAgent) return

      if (
        _.isEqual(
          { ...oldAgent, pingedAt: null },
          { ...newAgent, pingedAt: null }
        )
      ) {
        return
      }

      const id = oldAgent.id
      console.log('Agent has been updated, destroying old agent', id)

      const agent = this.agents[id]
      await agent.onDestroy()

      this.removeHandlers.forEach(handler => handler({ agent }))
      this.agents[id] = null
      delete this.currentAgents[i]
    }
  }

  /**
   * Update agent instances.
   */
  async updateAgents() {
    this.newAgents = (await this.app.service('agents').find({
      query: {
        enabled: true,
      },
    }))?.data
    if (!this.newAgents) return

    await this.deleteOldAgents()

    if (!this.newAgents || this.newAgents.length === 0) return

    this.newAgents?.forEach(async (agent: any) => {
      if (!agent) return
      if (!agent.data) return
      if (!agent.enabled && !agent.data.enabled) return
      if (!agent.rootSpell) return
      
      const pingedAt = new Date(agent.pingedAt)

      if (new Date().getTime() - pingedAt.getTime() < 5000) return

      const old = this.currentAgents?.find(a => a && a.id === agent.id)

      if (
        old &&
        _.isEqual({ ...old, pingedAt: null }, { ...agent, pingedAt: null })
      ) {
        return
      }

      const oldAgent = this.agents[agent.id]

      console.log(
        'Agent is enabled and has not been pinged, starting',
        agent.id
      )

      this.removeHandlers.forEach(handler => handler({ agent: oldAgent }))

      if (oldAgent) {
        await oldAgent.onDestroy()
      }

      this.currentAgents = this.currentAgents.filter(a => a.id !== agent.id)

      const data = {
        ...agent,
        pingedAt: new Date().toISOString(),
      }
      this.agents[agent.id] = new Agent(data, this, this.app)
      this.currentAgents.push(agent)

      this.addHandlers.forEach(handler =>
        handler({ agent: this.agents[agent.id], agentData: agent })
      )
    })
  }
}
