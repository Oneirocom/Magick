import Agent from './Agent'
import { ServerError } from '@magickml/server-core'
import { projectId, ENTITY_WEBSERVER_PORT_RANGE } from '@magickml/engine'
import { app } from './app'

// if the user is running the app locally, sort by their project id
// this way users can use our demo database without seeing each other's stuff
// for a multi-tenant case, until we have isolated pods for each user we isolate by project id
const isSingleUserMode = process.env.SINGLE_USER_MODE === 'true'
const query = isSingleUserMode ? { query: { projectId }} : {}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const maxMSDiff = 5000
let interval = 3000

function initEntityLoop(update: Function, lateUpdate: Function) {
  const date = new Date()

  async function entityLoop(update: Function, lateUpdate: Function) {
    const agents = (await app.service('agents').find(query)).data
    const now = new Date()
    const updated = []

    for (let i = 0; i < agents.length; i++) {
      const id = agents[i].id
      const lastUpdate = new Date(agents[i].updated_at ?? 0)
      if (now.valueOf() - lastUpdate.valueOf() > maxMSDiff) {
        update(id)

        updated.push(id)
        // TODO: update the db
        // database.setEntityUpdated(id)
      }
    }
    for (let i = 0; i < updated.length; i++) {
      lateUpdate(updated[i])
    }
  }
  setInterval(() => {
    entityLoop(
      (id: number) => {
        update(id)
      },
      (id: number) => {
        lateUpdate(id)
      }
    )
  }, interval)
}

export class World {
  static instance: World
  id = -1
  objects: { [id: number]: any } = {}
  oldAgents: any
  newAgents: any
  availablePorts: number[] = []

  constructor() {
    this.id = 0
    console.log('creating world')
    World.instance = this
    this.onCreate()
  }

  async updateAgent() {
    this.newAgents = (await app.service('agents').find(query)).data
    const newAgents = this.newAgents
    delete newAgents['updated_at']
    const oldAgents = this.oldAgents ?? []
    if (oldAgents['updated_at']) delete oldAgents['updated_at']
    await this.updateSpells();
    if (JSON.stringify(newAgents) === JSON.stringify(oldAgents)) return // They are the same
    //If Discord Enabled is True replace the old Agent with a new one
    for (const i in newAgents){
      try {
        let temp_agent = this.getAgent(newAgents[i].id)
        console.log("Inside TRY ")
        await temp_agent.onDestroy()
      } catch {
        console.log("Client Does not exist")
      }
      if (newAgents[i].data.discord_enabled){
        try {
          //Get the agent which was updated.
          let temp_agent = this.getAgent(newAgents[i].id)
          //Delete the Agent
          await temp_agent.onDestroy()
        } catch(e) {
          console.log("Couldn't delete the Discord Client.!! Caught Error: ",e)
        }
        this.addAgent(newAgents[i])
      } 
    }
    // If an entry exists in oldAgents but not in newAgents, it has been deleted
    for (const i in oldAgents) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        newAgents.filter((x: any) => x.id === oldAgents[i].id)[0] ===
        undefined
      ) {
        await this.removeAgent(oldAgents[i].id)
      }
    }

    // If an entry exists in newAgents but not in oldAgents, it has been added
    for (const i in newAgents) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        oldAgents.filter((x: any) => x.id === newAgents[i].id)[0] ===
        undefined
      ) {
        if (newAgents[i].enabled) {
          if (!(newAgents[i].data.discord_enabled)) await this.addAgent(newAgents[i])
        }
      }
    }

    for (const i in newAgents) {
      if (newAgents[i].dirty) {
        await this.removeAgent(newAgents[i].id)
        await this.addAgent(newAgents[i])

        await app.service('agents').patch(newAgents[i].id, {
          dirty: false
        })

      }
    }

    this.oldAgents = this.newAgents
  }

  async updateSpells() {
    for (const i in this.newAgents) {
      const agent = this.newAgents[i]
      const runningAgent = this.getAgent(agent.id)
      if(!runningAgent) continue;
      // evaluate the root spell
      if (agent.data.root_spell) {
        const spell = (await app.service('spells').find({
          query: { projectId, name: agent.data.root_spell },
        })).data[0]

          if (!runningAgent.root_spell_hash || spell.hash !== runningAgent.root_spell_hash) {
            // reload the spell
            console.log('reloading root spell', spell.name)
            const spellRunner = await runningAgent.spellManager.load(spell)
            runningAgent.root_spell_hash = spell.hash
          }
      }

      // evaluate all spells
      if (agent.spells.length > 0) {
        // for each spell in agent.spells, get the hash from the db
        // if the hash is not the same as agent.spells.hash, then reload the spell
        // otherwise set agent.spells.hash to the hash of the spell
        const spells = (await app.service('spells').find({
          query: { projectId, name: { $in: agent.spells } },
        })).data

        for (const j in spells) {
          const spell = spells[j]
          if(!runningAgent.spells_hash) runningAgent.spells_hash = []
          if (spell.hash !== runningAgent.spells_hash[j]) {
            // reload the spell
            console.log('reloading spell', spell.name)
            const spellRunner = await runningAgent.spellManager.load(spell)
            runningAgent.spells_hash[j] = spell.hash
          }
        }
      }
    }
  }


  async resetAgentSpells() {
    const agents = (await app.service('agents').find()).data
    for (const i in agents) {
      // rewrite as a feathers service call to empty
      //@ts-ignore
      await app.service('agents').patch(agents[i].id, {
        spells: [],
      })
    }
  }

  async onCreate() {
    const ports: string[] = ((ENTITY_WEBSERVER_PORT_RANGE?.split(
      '-'
    ) as any) ?? ['10001', '10100']) as string[]
    let portStart: number = parseInt(ports[0])
    let portEnd: number = parseInt(ports[1])
    if (portStart > portEnd) {
      const temp = portStart
      portStart = portEnd
      portEnd = temp
    }
    for (let i = portStart; i <= portEnd; i++) {
      this.availablePorts.push(i)
    }

    this.resetAgentSpells()

    initEntityLoop(
      async (id: number) => {
        await this.updateAgent()
        this.updateInstance(id)
      },
      async (id: number) => {
        this.lateUpdateInstance(id)
      }
    )
  }

  async updateInstance(id: number) {
    for (const i in this.objects) {
      if (this.objects[i].id === id) {
        // await (this.objects[i]).onUpdate()
        return
      }
    }
  }
  async lateUpdateInstance(id: number) {
    for (const i in this.objects) {
      if (this.objects[i].id === id) {
        // await (this.objects[i])?.onLateUpdate()
        return
      }
    }
  }

  async onDestroy() {}

  async addAgent(obj: any) {
    const data = {...obj.data, id: obj.id, enabled: obj.enabled, dirty: obj.dirty, spells: obj.spells, updated_at: obj.updated_at}
    console.log("SERVER", data.id)
    //Overwrites even if already exists
    data.projectId = projectId
    this.objects[data.id] = new Agent(data)
  }

  async removeAgent(id: number) {
    if (this.objectExists(id)) {
      await this.objects[id]?.onDestroy()
      this.objects[id] = null
      delete this.objects[id]
    }
  }

  getAgent(id: any) {
    let res = null

    for (let x in this.objects) {
      if (x == id) {
        res = this.objects[x]
      }
    }

    return res
  }

  objectExists(id: any) {
    return this.getAgent(id) !== null && this.getAgent(id) !== undefined
  }

  generateId(): number {
    let id = randomInt(0, 10000)
    while (this.objectExists(id)) {
      id = randomInt(0, 10000)
    }
    return id
  }

  getAvailablePort(): number {
    const port = this.availablePorts.pop()
    if (port === undefined) {
      throw new Error('No available ports')
    }
    return port
  }
}
