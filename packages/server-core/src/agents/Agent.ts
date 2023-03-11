import { buildMagickInterface } from '../helpers/buildMagickInterface'
import { SpellManager, WorldManager, pluginManager } from '@magickml/engine'
import { app } from '../app'
import { AgentManager } from './AgentManager'

type AgentData = {
  id: any
  data: any
  name: string
  secrets: string
  rootSpell: string
  publicVariables: any[]
  projectId: string
  spellManager: SpellManager
  agent?: any
  enabled: boolean
}

export class Agent {
  name = ''
  //Clients
  id: any
  secrets: Record<string, any>
  publicVariables: any[]
  data: AgentData
  router: any
  app: any
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager
  agentManager: AgentManager
  spellRunner: any
  rootSpell: any

  outputTypes = {}

  updateInterval: any

  constructor(agentData: AgentData, agentManager: AgentManager) {
    console.log('constructing agent', agentData.id)
    // if ,data,secrets is a string, JSON parse it
    this.secrets = JSON.parse(agentData.secrets)
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.rootSpell = JSON.parse(agentData.rootSpell ?? '{}')
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId
    this.worldManager = new WorldManager()

    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    })
      ; (async () => {
        const spell = (
          await app.service('spells').find({
            query: {
              projectId: agentData.projectId,
              id: this.rootSpell.id,
            },
          })
        ).data[0]

        // if the spell has changed, override it
        const spellData = JSON.stringify(spell)
        const rootSpellData = JSON.stringify(this.rootSpell)
        const override = spellData !== rootSpellData

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
          // every second, update the agent, set updatedAt to now
          app.service('agents').patch(this.id, {
            updatedAt: new Date().toISOString(),
          })
        }, 1000)
      })()
  }

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

export default Agent
