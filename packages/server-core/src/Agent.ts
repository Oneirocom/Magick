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
  agent?: Object
}

export class Agent {
  name = ''
  //Clients
  id: any
  secrets: Object
  publicVariables: any[]
  data: AgentData
  router: any
  app: any
  loopHandler: any
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager
  agentManager: AgentManager

  constructor(data: AgentData, agentManager: AgentManager) {
    console.log('data', data)
    // if ,data,secrets is a string, JSON parse it
    this.secrets = JSON.parse(data.secrets)
    this.publicVariables = data.publicVariables
    this.id = data.id
    this.data = data
    this.agentManager = agentManager
    this.name = data.name ?? 'agent'
    this.projectId = data.projectId
    this.worldManager = new WorldManager()

    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    });
    (async () => {
      const spell = (
        await app.service('spells').find({
          query: { projectId: data.projectId },
        })
      ).data[0]

      const spellRunner = await this.spellManager.load(spell)
      const agentStartMethods = pluginManager.getAgentStartMethods()
      for (const method of Object.keys(agentStartMethods)) {
        await agentStartMethods[method]({
          agentManager,
          projectId: data.projectId,
          data: data.data,
          agent: this,
          spellRunner,
          worldManager: this.worldManager,
        })
      }
    })()
  }

  async onDestroy() {
    const agentStopMethods = pluginManager.getAgentStopMethods()
    console.log('agentStopMethods', agentStopMethods)
    for (const method of Object.keys(agentStopMethods)) {
      console.log('method', method)
      agentStopMethods[method](this)
    }
  }
}

export default Agent
