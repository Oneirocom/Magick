// DOCUMENTED
import Agent from './Agent'
import _ from 'lodash'
import pino from 'pino'
import { getLogger } from '@magickml/core'

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
      this.logger.trace("AgentManager can't find agent %o", agent)
    }
    return this.agents[agent.id]
  }

  /**
   * Create an agent manager.
   */
  constructor(app) {
    this.app = app
    // Update agents every second
    setInterval(async () => {
      this.logger.debug('Updating agents...')
      await this.updateAgents()
      this.logger.debug('Agents updated.')
    }, 1000)
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
    this.logger.debug('Updating agents...')

    this.newAgents = (
      await this.app.service('agents').find({
        query: {
          enabled: true,
        },
      })
    )?.data

    if (!this.newAgents || this.newAgents.length === 0) {
      this.logger.debug('No new agents found.')
      this.logger.debug('Done updating agents.')
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

      if (new Date().getTime() - pingedAt.getTime() < 5000) return

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
