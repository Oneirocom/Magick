import { randomInt } from './connectors/utils'
import { database } from '@magickml/database'
import Agent from './Agent'
import { prisma } from '@magickml/prisma'
import { CustomError } from 'apps/server/src/utils/CustomError'
import { ENTITY_WEBSERVER_PORT_RANGE } from '@magickml/server-config'

const maxMSDiff = 5000
let interval = 3000

function initEntityLoop(update: Function, lateUpdate: Function) {
  const date = new Date()

  async function entityLoop(update: Function, lateUpdate: Function) {
    const agents = await database.getLastUpdatedInstances()
    const now = new Date()
    const updated = []

    for (let i = 0; i < agents.length; i++) {
      const id = agents[i].id
      const lastUpdate = new Date(agents[i].lastUpdated ?? 0)
      if (now.valueOf() - lastUpdate.valueOf() > maxMSDiff) {
        update(id)

        updated.push(id)
        database.setEntityUpdated(id)
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
    this.newAgents = await database.getAgents()
    const newAgents = this.newAgents
    delete newAgents['updated_at']
    const oldAgents = this.oldAgents ?? []
    if (oldAgents['updated_at']) delete oldAgents['updated_at']
    if (JSON.stringify(newAgents) === JSON.stringify(oldAgents)) return // They are the same

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
          await this.addAgent(newAgents[i])
        }
      }
    }

    for (const i in newAgents) {
      if (newAgents[i].dirty) {
        await this.removeAgent(newAgents[i].id)
        await this.addAgent(newAgents[i])
        await database.markAgentDirty(newAgents[i].id, false)
      }
    }

    this.oldAgents = this.newAgents
  }

  async resetAgentSpells() {
    const agents = await prisma.agents.findMany()
    for (const i in agents) {
      await prisma.agents.update({
        where: { id: agents[i].id },
        data: {
          spells: {
            set: [],
          },
        },
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
    const data = JSON.parse(obj.data)
    obj = {...obj, ...data}
    if (this.objects[obj.id] === undefined) {
      obj.data = JSON.parse(obj.data)
      obj.data.id = obj.id
      this.objects[obj.id] = new Agent(obj)
    } else {
      throw new CustomError('already-exists', 'Object already exists')
    }
  }

  async removeAgent(id: number) {
    if (this.objectExists(id)) {
      await this.objects[id]?.onDestroy()
      this.objects[id] = null
      delete this.objects[id]
      console.log('Removed ', id)
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
