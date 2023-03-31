import Router from '@koa/router'
import { AgentInterface, pluginManager, SpellInterface, SpellManager, SpellRunner, WorldManager } from '@magickml/engine'
import { app } from '../app'
import { Application } from '../declarations'
import { buildMagickInterface } from '../helpers/buildMagickInterface'
import { AgentManager } from './AgentManager'

type AgentData = {
  id: any
  data: any
  name: string
  secrets: string
  rootSpell: any
  subSpells: any[]
  publicVariables: any[]
  projectId: string
  spellManager: SpellManager
  agent?: any
  enabled: boolean
}

export class Agent implements AgentInterface {
  name = ''
  //Clients
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
  subSpells: any[]

  constructor(agentData: AgentData, agentManager: AgentManager) {
    if(!agentData.secrets) throw new Error('No secrets found for agent')
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
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    });

    if(!this.rootSpell) {
      console.warn("No root spell found for agent", this.id)
      return
    }
    
    (async () => {
      const spell = (
        await app.service('spells').find({
          query: {
            projectId: this.projectId,
            id: this.rootSpell.id,
          },
        })
      ).data[0]

      if (!spell) {
        console.warn('No spell found for agent', this.id)
        return
      }

      this.spellRunner = await this.spellManager.load(spell, true)

    // handle subspells
      const nodes = spell.graph.nodes;

      const subspellNodes = Object.values(nodes || {}).filter(
        node => {
          console.log('node is', node);
          return (node as { name: string }).name === 'Spell'
      })

      console.log('******************** LOADING SUBSPELLS')
      console.log(subspellNodes)

      const subspells = []
      for (const subspellNode of subspellNodes as {data: {projectId: string, spellId: string}}[]) {
        // fetch the spell from the spells service
        const spell = (
          await app.service('spells').find({
            query: {
              projectId: subspellNode.data.projectId,
              id: subspellNode.data.spellId,
            },
          })
        ).data[0]

        if (!spell) {
          console.warn('No subspell found for', subspellNode.data.projectId, this.id)
          return
        }
        this.spellManager.load(spell, true)
        subspells.push(spell)
      }

      this.subSpells = subspells;

      // nodes is an object, with the node ID as the key
      // iterate through the nodes 

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
