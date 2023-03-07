import { buildMagickInterface } from '../helpers/buildMagickInterface'
import { SpellManager, WorldManager, pluginManager } from '@magickml/engine'
import { app } from '../app'

type AgentData = {
  id: any
  data: any
  name: string
  secrets: string
  publicVariables: any[]
  projectId: string
  spellManager: SpellManager
  agent?: Record<string, any>
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
  loopHandler: any
  spellManager: SpellManager
  projectId: string
  worldManager: WorldManager

  constructor(data: AgentData) {
    // if ,data,secrets is a string, JSON parse it
    this.secrets = JSON.parse(data.secrets)
    this.publicVariables = data.publicVariables
    this.id = data.id
    this.data = data
    this.name = data.name ?? 'agent'
    this.projectId = data.projectId
    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    })
    this.worldManager = new WorldManager()
    ;
    (async () => {
      const spell = (
        await app.service('spells').find({
          query: { projectId: data.projectId },
        })
      ).data[0]

      const spellRunner = await this.spellManager.load(spell)
        console.log('agent.data', data.data)
      const agentStartMethods = pluginManager.getAgentStartMethods()
      for (const method of Object.keys(agentStartMethods)) {
        console.log('method', method)
        await agentStartMethods[method]({
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
