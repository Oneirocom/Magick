// DOCUMENTED
import { Application } from '@feathersjs/koa'
import { SpellManager, SpellRunner } from '../spellManager/index'
import { WorldManager } from '../world/worldManager'
import { pluginManager } from '../plugin'
import { AgentInterface, SpellInterface } from '../schemas'
import { AgentManager } from './AgentManager'
import _ from 'lodash'

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables: Record<string, string>
  data: AgentInterface
  app: any
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager
  agentManager: AgentManager
  spellRunner?: SpellRunner
  rootSpell: SpellInterface

  outputTypes: any[] = []
  updateInterval: any

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   * @param agentManager {AgentManager} - The instance's manager.
   */
  constructor(
    agentData: AgentInterface,
    agentManager: AgentManager,
    app: Application
  ) {
    console.log('creating new agent')
    this.secrets = agentData?.secrets ? JSON.parse(agentData?.secrets) : {}
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.rootSpell = agentData.rootSpell ?? {}
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId
    const worldManager = new WorldManager()
    this.worldManager = worldManager
    this.app = app

    const spellManager = new SpellManager({
      cache: false,
      agent: this,
      app,
    })

    this.spellManager = spellManager
    ;(async () => {
      if (!agentData.rootSpell) {
        this.warn('No root spell found for agent', { id: this.id })
        return
      }
      const spell = (
        await this.app.service('spells').find({
          query: {
            projectId: agentData.projectId,
            id: agentData.rootSpell.id,
          },
        })
      ).data[0]

      const override = _.isEqual(spell, agentData.rootSpell)

      this.spellRunner = await spellManager.load(spell, override)
      console.log('loaded spell runner', this.spellRunner)
      const agentStartMethods = pluginManager.getAgentStartMethods()

      for (const method of Object.keys(agentStartMethods)) {
        try {
          await agentStartMethods[method]({
            agentManager,
            agent: this,
            spellRunner: this.spellRunner,
            worldManager: worldManager,
          })
        } catch (err) {
          this.error('Error in agent start method', { method, err })
        }
      }

      const outputTypes = pluginManager.getOutputTypes()
      this.outputTypes = outputTypes

      this.updateInterval = setInterval(() => {
        // every second, update the agent, set pingedAt to now
        this.app.service('agents').patch(this.id, {
          pingedAt: new Date().toISOString(),
        })
      }, 1000)
      console.log('new agent created')
    })()
  }

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    const agentStopMethods = pluginManager.getAgentStopMethods()
    if (agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        agentStopMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
          worldManager: this.worldManager,
        })
      }
    this.log('destroyed agent', { id: this.id })
  }

  log(message, data) {
    console.log(message, data)
    this.app.service('agents').log({
      agentId: this.id,
      type: 'log',
      message,
      data,
    })
  }

  warn(message, data) {
    console.warn(message, data)
    this.app.service('agents').log({
      agentId: this.id,
      type: 'warn',
      message,
      data,
    })
  }

  error(message, data = {}) {
    console.error(message, { error: data })
    this.app.service('agents').log({
      agentId: this.id,
      type: 'error',
      message,
      data: { error: data },
    })
  }
}

// Exporting Agent class as default
export default Agent
