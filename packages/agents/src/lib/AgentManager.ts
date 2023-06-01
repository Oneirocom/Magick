// DOCUMENTED
import Agent from './Agent'
import _ from 'lodash'
import pino from 'pino'
import { AGENT_UPDATE_TIME_MSEC, PING_AGENT_TIME_MSEC, getLogger } from '@magickml/core'

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
  logger: pino.Logger = getLogger()

  /**
   * Get the agent with the given agent data.
   * @param agent - The agent data.
   * @returns The agent if found.
   */
  getAgent({ agent }) {
    if (!agent) {
      this.logger.error("AgentManager can't find agent %o", agent)
    }
    return this.agents[agent.id]
  }

  /**
   * Create an agent manager.
   */
  constructor(app) {
    this.app = app

    app.set('isAgent', true)
    // Update agents every second
    setInterval(async () => {
      await this.updateAgents()
    }, AGENT_UPDATE_TIME_MSEC)
  }

  /**
   * Register a handler to be called when an agent is added.
   * @param handler - The handler function to be called.
   */
  registerAddAgentHandler(handler) {
    this.logger.debug('Registering add agent handler')
    this.addHandlers.push(handler)
  }

  /**
   * Register a handler to be called when an agent is removed.
   * @param handler - The handler function to be called.
   */
  registerRemoveAgentHandler(handler) {
    this.logger.debug('Registering remove agent handler')
    this.removeHandlers.push(handler)
  }

  /**
   * Delete old agent instances.
   */
  async deleteOldAgents() {
    this.logger.debug('Deleting old agents...')
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
    this.logger.debug('Old agents deleted.')
  }

  /**
   * Update agent instances.
   */
  async updateAgents() {
    this.logger.trace('Updating agents...')

    this.newAgents = (
      await this.app.service('agents').find({
        query: {
          enabled: true,
        },
      })
    )?.data

    if (!this.newAgents || this.newAgents.length === 0) {
      this.logger.trace('No new agents found.')
      return
    }

    await this.deleteOldAgents()

    this.newAgents?.forEach(async (agent: any) => {
      if (!agent) {
        this.logger.fatal('Agent is null in updateAgents loop')
        return
      }
      if (!agent.data) {
        this.logger.fatal('Agent data is null in updateAgents loop')
        return
      }
      if (!agent.enabled && !agent.data.enabled) {
        this.logger.debug('Agent is disabled, skipping %s', agent.id)
        return
      }
      if (!agent.rootSpell) {
        this.logger.debug('Agent has no root spell, skipping %s', agent.id)
        return
      }

      const pingedAt = new Date(agent.pingedAt)

      if (new Date().getTime() - pingedAt.getTime() < PING_AGENT_TIME_MSEC * 5) return

      const old = this.currentAgents?.find(a => a && a.id === agent.id)

      if (
        old &&
        _.isEqual({ ...old, pingedAt: null }, { ...agent, pingedAt: null })
      ) {
        return
      }

      const oldAgent = this.agents[agent.id]

      this.logger.info(
        'Agent %s is enabled and has not been pinged, starting',
        agent.id
      )

      if (oldAgent) {
        this.removeHandlers.forEach(handler => handler({ agent: oldAgent }))
        await oldAgent.onDestroy()
      }

      this.currentAgents = this.currentAgents.filter(a => a.id !== agent.id)

      const data = {
        ...agent,
        pingedAt: new Date().toISOString(),
      }
      const agentInstance = new Agent(data, this, this.app)

      // we need to wait for the agent to initialize before we can use its
      await agentInstance.initialize({})
      this.agents[agent.id] = agentInstance
      this.currentAgents.push(agent)

      this.addHandlers.forEach(handler =>
        handler({ agent: this.agents[agent.id], agentData: agent })
      )
    })
    this.logger.trace('Agents updated.')
  }
}
