import { randomInt } from './connectors/utils'
import { database } from '../database'
import Entity from './Entity'
import { cacheManager } from '../cacheManager'
import net from 'net'

const maxMSDiff = 5000
let interval = 3000

function initEntityLoop(update: Function, lateUpdate: Function) {
  const date = new Date()

  async function entityLoop(update: Function, lateUpdate: Function) {
    const agents = await database.instance.getLastUpdatedInstances()
    const now = new Date()
    const updated = []

    for (let i = 0; i < agents.length; i++) {
      const id = agents[i].id
      const lastUpdate = new Date(agents[i].lastUpdated ?? 0)
      if (now.valueOf() - lastUpdate.valueOf() > maxMSDiff) {
        update(id)

        updated.push(id)
        database.instance.setEntityUpdated(id)
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
    this.newEntities = await database.instance.getEntities()
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
          await this.addEntity(
            new Entity(newEntities[i], this.getAvailablePort())
          )
        }
      }
    }

    for (const i in newEntities) {
      if (newEntities[i].dirty) {
        await this.removeEntity(newEntities[i].id)
        await this.addEntity(
          new Entity(newEntities[i], this.getAvailablePort())
        )
        await database.instance.setEntityDirty(newEntities[i].id, false)
      }
    }

    this.oldEntities = this.newEntities
  }

  async onCreate() {
    if (!cacheManager.instance) {
      new cacheManager()
    }

    const cachedPorts = await cacheManager.instance.get('CACHED_FREE_PORTS')
    console.log('creating world with available ports:', cachedPorts, '.env ports:', process.env.ENTITY_WEBSERVER_PORT_RANGE)
    const cp = cachedPorts.split(',')
    const ports: string[] = process.env.ENTITY_WEBSERVER_PORT_RANGE?.split(
      '-'
    ) as any
    let portStart: number = parseInt(ports[0])
    let portEnd: number = parseInt(ports[1])
    if (portStart > portEnd) {
      const temp = portStart
      portStart = portEnd
      portEnd = temp
    }
    let found = false
    for (let i = portStart; i <= portEnd; i++) {
      found = false
      for (let j = 0; j < cp.length; j++) {
        if (cp[j] === i) {
          found = true
          break;
        }
      }

      if (!found) {
        this.availablePorts.push(i)
      }
    }

    console.log('added ' + this.availablePorts.length + ' ports')

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

  async onDestroy() { }

  async addEntity(obj: any) {
    console.log('adding object', obj.id)
    if (this.objects[obj.id] === undefined) {
      this.objects[obj.id] = obj
    } else {
      //throw new Error('Object already exists')
    }
  }

  async removeEntity(id: number) {
    if (this.objectExists(id)) {
      this.freePort(this.objects[id]?.port)
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
    console.log('GETTING AVAILABLE PORTS FROM:', this.availablePorts)
    const port = this.availablePorts.pop()
    if (port === undefined) {
      throw new Error('No available ports')
    }
    if (this.checkIfPortIsUsed(port)) {
      if (this.availablePorts.length > 1) {
        return this.getAvailablePort();
      }
      else {
        throw new Error('No available ports')
      }
    }

    cacheManager.instance.set(
      'CACHED_FREE_PORTS',
      this.availablePorts.join(',')
    )
    return port
  }

  freePort(port: number): void {
    if (port && port > 0) {
      if (!this.availablePorts.includes(port)) {
        this.availablePorts.push(port)
      }
    }
  }

  checkIfPortIsUsed(port: number): boolean {
    const tester = net.createServer()
    try {
      tester.listen(port)
    } catch (e) { return true; }
    tester.close()
    return false
  }
}