// DOCUMENTED
import { buildMagickInterface } from '../helpers/buildMagickInterface'
import {
  SpellManager,
  WorldManager,
  pluginManager,
  SpellRunner,
  AgentInterface,
  SpellInterface,
} from '@magickml/engine'
import { app } from '../app'
import { AgentManager } from './AgentManager'
import Router from '@koa/router'
import _ from 'lodash'
import { Application } from '../declarations'

/**
 * The type for AgentData.
 */
type AgentData = {
  id: any
  data: any
  name: string
  secrets: string
  rootSpell: any
  publicVariables: any[]
  projectId: string
  spellManager: SpellManager
  agent?: any
  enabled: boolean
}

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables: any[]
  data: AgentData
  router: Router
  app: Application
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager
  agentManager: AgentManager
  spellRunner: SpellRunner
  rootSpell: SpellInterface
  updatedAt: string

  outputTypes: any[] = []
  updateInterval: any

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   * @param agentManager {AgentManager} - The instance's manager.
   */
  constructor(agentData: AgentData, agentManager: AgentManager) {
    this.secrets = JSON.parse(agentData.secrets)
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.rootSpell = agentData.rootSpell ?? {}
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId
    this.worldManager = new WorldManager()

    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface() as any,
      cache: false,
    })
    ;(async () => {
      if (!this.rootSpell) {
        console.warn('No root spell found for agent', this.id)
        return
      }
      console.log('this.rootSpell.projectId', this.projectId, this.rootSpell.id)
      const spell = (
        await app.service('spells').find({
          query: {
            projectId: this.projectId,
            id: this.rootSpell.id,
          },
        })
      ).data[0]

      const override = _.isEqual(spell, this.rootSpell)

      this.spellRunner = await this.spellManager.load(spell, override)
      const agentStartMethods = pluginManager.getAgentStartMethods()

      for (const method of Object.keys(agentStartMethods)) {
        await agentStartMethods[method]({
          agentManager,
          agent: this,
          spellRunner: this.spellRunner,
          worldManager: this.worldManager,
        })
      }

      const outputTypes = pluginManager.getOutputTypes()
      this.outputTypes = outputTypes

      this.updateInterval = setInterval(() => {
        // every second, update the agent, set pingedAt to now
        app.service('agents').patch(this.id, {
          pingedAt: new Date().toISOString(),
        })
      }, 1000)
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
    console.log('destroyed agent', this.id)
  }
}

// Exporting Agent class as default
export default Agent
