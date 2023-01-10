import { randomInt } from './connectors/utils'
import { database } from '@magickml/database'
import Entity from './Entity'
import { prisma } from '@magickml/prisma'

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
  oldEntities: any
  newEntities: any
  availablePorts: number[] = []

  constructor() {
    this.id = 0
    console.log('creating world')
    World.instance = this
    this.onCreate()
  }

  async updateEntity() {
    this.newEntities = await database.getEntities()
    const newEntities = this.newEntities
    delete newEntities['updated_at']
    const oldEntities = this.oldEntities ?? []
    if (oldEntities['updated_at']) delete oldEntities['updated_at']
    if (JSON.stringify(newEntities) === JSON.stringify(oldEntities)) return // They are the same

    // If an entry exists in oldAgents but not in newAgents, it has been deleted
    for (const i in oldEntities) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        newEntities.filter((x: any) => x.id === oldEntities[i].id)[0] ===
        undefined
      ) {
        await this.removeEntity(oldEntities[i].id)
      }
    }

    // If an entry exists in newAgents but not in oldAgents, it has been added
    for (const i in newEntities) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        oldEntities.filter((x: any) => x.id === newEntities[i].id)[0] ===
        undefined
      ) {
        if (newEntities[i].enabled) {
          await this.addEntity(newEntities[i])
        }
      }
    }

    for (const i in newEntities) {
      if (newEntities[i].dirty) {
        await this.removeEntity(newEntities[i].id)
        await this.addEntity(newEntities[i])
        await database.setEntityDirty(newEntities[i].id, false)
      }
    }

    this.oldEntities = this.newEntities
  }

  async resetEntitySpells() {
    const entities = await prisma.entities.findMany()
    for (const i in entities) {
      await prisma.entities.update({
        where: { id: entities[i].id },
        data: {
          spells: {
            set: [],
          },
        },
      })
    }
  }

  async onCreate() {
    const ports: string[] = ((process.env.ENTITY_WEBSERVER_PORT_RANGE?.split(
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

    // reset all entities to remove any references to spells
    this.resetEntitySpells()

    initEntityLoop(
      async (id: number) => {
        await this.updateEntity()
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

  async addEntity(obj: any) {
    console.log('adding object', obj.id)
    if (this.objects[obj.id] === undefined) {
      obj.data.id = obj.id
      this.objects[obj.id] = new Entity(obj.data)
    } else {
      //throw new Error('Object already exists')
    }
  }

  async removeEntity(id: number) {
    if (this.objectExists(id)) {
      await this.objects[id]?.onDestroy()
      this.objects[id] = null
      delete this.objects[id]
      console.log('Removed ', id)
    }
  }

  getEntity(id: any) {
    let res = null

    for (let x in this.objects) {
      if (x == id) {
        res = this.objects[x]
      }
    }

    return res
  }

  objectExists(id: any) {
    return this.getEntity(id) !== null && this.getEntity(id) !== undefined
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
