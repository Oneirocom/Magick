// DOCUMENTED
import { SpellManager, SpellRunner } from '../spellManager/index';
import { WorldManager } from '../world/worldManager';
import { pluginManager } from '../plugin';
import { AgentInterface, SpellInterface } from '../schemas';
import { AgentManager } from './AgentManager'
import _ from 'lodash'

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
  constructor(agentData: AgentData, agentManager: AgentManager, app: any) {
    this.secrets = JSON.parse(agentData.secrets)
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
    })

    this.spellManager = spellManager
    ;(async () => {
      if (!agentData.rootSpell) {
        console.warn('No root spell found for agent', this.id)
        return
      }
      console.log(
        'this.rootSpell.projectId',
        agentData.projectId,
        agentData.rootSpell.id
      )
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
      const agentStartMethods = pluginManager.getAgentStartMethods()

      for (const method of Object.keys(agentStartMethods)) {
        await agentStartMethods[method]({
          agentManager,
          agent: this,
          spellRunner: this.spellRunner,
          worldManager: worldManager,
        })
      }

      const outputTypes = pluginManager.getOutputTypes()
      this.outputTypes = outputTypes

      this.updateInterval = setInterval(() => {
        // every second, update the agent, set pingedAt to now
        this.app.service('agents').patch(this.id, {
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
