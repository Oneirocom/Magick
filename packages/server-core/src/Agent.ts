import { buildMagickInterface } from './buildMagickInterface'
import { SpellManager, WorldManager, pluginManager } from '@magickml/engine'
import { app } from './app'
import { AgentManager } from './AgentManager'

type AgentData = {
  id: any
  data: any
  name: string
  secrets: string
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
  secrets: any
  publicVariables: any[]
  data: AgentData
  router: any
  app: any
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager
  agentManager: AgentManager
  spellRunner: any

  updateInterval: any

  constructor(agentData: AgentData, agentManager: AgentManager) {
    console.log('constructing agent', agentData.id)
    // if ,data,secrets is a string, JSON parse it
    this.secrets = JSON.parse(agentData.secrets)
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId
    this.worldManager = new WorldManager()

    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    });
    (async () => {
      const spell = (
        await app.service('spells').find({
          query: { projectId: agentData.projectId },
        })
      ).data[0]

      this.spellRunner = await this.spellManager.load(spell)
      const agentStartMethods = pluginManager.getAgentStartMethods()
      for (const method of Object.keys(agentStartMethods)) {
        await agentStartMethods[method]({
          agentManager,
          agent: this,
          spellRunner: this.spellRunner,
          worldManager: this.worldManager,
        })
      }

      this.updateInterval = setInterval(() => {
        // every second, update the agent, set updatedAt to now
        app.service('agents').patch(this.id, {
          updatedAt: new Date().toISOString(),
        })
      }, 1000)
        
    })()
  }

  async onDestroy() {
    if(this.updateInterval){
      clearInterval(this.updateInterval)
    }
    const agentStopMethods = pluginManager.getAgentStopMethods()
    console.log('agentStopMethods', agentStopMethods)
    if(agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        agentStopMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
          worldManager: this.worldManager
        })
      }
      console.log('destroyed agent', this.id)
  }
}

export default Agent
