type Secret = {
  name: string
  key: string
  global?: boolean
}

type DrawerItem = {
  path: string
  icon: any
  text: string
}

type ClientRoute = {
  path: string
  component: any
  exact?: boolean
}

type ServerRoute = {
  path: string
  method: string
  handler: Function
}

type PluginConstuctor = {
  name: string
  nodes?: any
  inputTypes?: any[]
  outputTypes?: any[]
  secrets?: Secret[]
}
class Plugin {
  name: string
  nodes: any
  inputTypes: any[]
  outputTypes: any[]
  secrets: Secret[] = []
  constructor({ name, nodes = [], inputTypes = [], outputTypes = [], secrets = [] }: PluginConstuctor) {
    this.name = name
    this.nodes = nodes
    this.inputTypes = inputTypes
    this.outputTypes = outputTypes
    this.secrets = secrets
  }
}

export class ClientPlugin extends Plugin {
  agentComponents: any[]
  drawerItems?: Array<DrawerItem>
  clientPageLayout?: any
  clientRoutes?: Array<ClientRoute>
  constructor({
    name,
    nodes = [],
    agentComponents = [],
    inputTypes = [],
    outputTypes = [],
    clientPageLayout = null,
    clientRoutes = [],
    drawerItems = [],
    secrets = [],
  }: {
    name: string
    nodes?: any
    agentComponents?: any
    inputTypes?: any[]
    outputTypes?: any[]
    clientPageLayout?: any
    clientRoutes?: Array<ClientRoute>
    drawerItems?: Array<DrawerItem>
    secrets?: Secret[]
  }) {
    super({
      name,
      nodes,
      inputTypes,
      outputTypes,
      secrets,
    })
    this.clientPageLayout = clientPageLayout
    this.agentComponents = agentComponents
    this.clientRoutes = clientRoutes
    this.drawerItems = drawerItems
    pluginManager.register(this)
  }
}

export class ServerPlugin extends Plugin {
  services: any
  serverInit?: Function
  agentMethods?: {
    start: Function
    stop: Function
  }
  serverRoutes?: Array<ServerRoute>
  constructor({
    name,
    nodes = [],
    services = [],
    inputTypes = [],
    outputTypes = [],
    serverInit = () => null,
    agentMethods = {
      start: () => {
      },
      stop: () => {
      },
    },
    serverRoutes = [],
    secrets = [],
  }: {
    name: string
    nodes?: any
    services?: any
    serverInit?: Function
    agentMethods?: {
      start: Function
      stop: Function
    }
    inputTypes?: any[]
    outputTypes?: any[]
    serverRoutes?: Array<ServerRoute>
    secrets?: Secret[]
  }) {
    super({
      name,
      nodes,
      inputTypes,
      outputTypes,
      secrets,
    })
    this.services = services
    this.agentMethods = agentMethods
    this.serverInit = serverInit
    this.serverRoutes = serverRoutes
    pluginManager.register(this)
  }
}

class PluginManager {
  pluginList: Array<ClientPlugin | ServerPlugin>
  componentList: Object
  plugins
  constructor() {
    this.pluginList = new Array<ClientPlugin | ServerPlugin>()
    this.componentList = {}
  }

  register(plugin: ClientPlugin | ServerPlugin) {
    this.pluginList.push(plugin)
  }

  getInputTypes() {
    const inputTypes = [] as any[]
    this.pluginList.forEach(plugin => {
      plugin.inputTypes.forEach(inputType => {
        inputTypes.push(inputType)
      })
    })
    return inputTypes
  }

  getOutputTypes() {
    const outputTypes = [] as any[]
    this.pluginList.forEach(plugin => {
      plugin.outputTypes.forEach(outputType => {
        outputTypes.push(outputType)
      })
    })
    return outputTypes
  }

  getNodes() {
    let nodes = {}

    this.pluginList.forEach(plugin => {
      let plug_nodes = {}
      plugin.nodes.forEach(node => {
        const id = Math.random().toString(36).slice(2, 7)
        const obj = {}
        obj[id] = () => new node()
        plug_nodes = { ...plug_nodes, ...obj }
      })
      nodes = { ...nodes, ...plug_nodes }
    })

    return nodes
  }

  getSecrets(global = false) {
    const secrets = [] as any[]
    this.pluginList.forEach(plugin => {
      plugin.secrets.forEach(secret => {
        if(global && !secret.global) return
        secrets.push(secret)
      })
    })
    console.log('secrets', secrets)
    return secrets
  }

  async teardown(plugin: Plugin) {
    this.pluginList.pop()
  }
}

class ClientPluginManager extends PluginManager {
  pluginList: Array<ClientPlugin>
  constructor() {
    super()
    this.pluginList = new Array<ClientPlugin>()
  }

  getAgentComponents() {
    const agentComp = [] as any[]
    (this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      plugin.agentComponents.forEach(component => {
        agentComp.push(component)
      })
    })
    return agentComp
  }

  getClientRoutes() {
    const clientRoutes = [] as any[]
    (this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      if (plugin.clientRoutes) {
        plugin.clientRoutes.forEach(route => {
          clientRoutes.push({ ...route, plugin: plugin.name })
        })
      }
    })
    return clientRoutes
  }

  getGroupedClientRoutes() {
    let lastPluginRoute = ''
    const pluginRoutes = this.getClientRoutes()
    const pluginRoutesGrouped = pluginRoutes.reduce((acc, route) => {
      if (route.plugin !== lastPluginRoute) {
        acc.push({
          plugin: route.plugin,
          routes: [route],
        })
      } else {
        acc[acc.length - 1].routes.push(route)
      }
      lastPluginRoute = route.plugin
      return acc
    }, [])

    pluginRoutesGrouped.map(pluginRouteGroup => {
      const ClientPageLayout =
        pluginManager.getClientPageLayout(pluginRouteGroup.plugin) || null
      pluginRouteGroup.layout = ClientPageLayout
    })
    return pluginRoutesGrouped
  }

  getClientPageLayout(p) {
    const plugin = this.pluginList.filter(
      plugin => plugin.name === p
    )[0] as ClientPlugin

    return plugin.clientPageLayout
  }

  getDrawerItems() {
    const drawerItems = [] as any[]
    (this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      if (plugin.drawerItems) {
        plugin.drawerItems.forEach(drawerItem => {
          drawerItems.push({ ...drawerItem, plugin: plugin.name })
        })
      }
    })
    return drawerItems
  }

  getInputTypes() {
    const inputTypes = [] as any[]
    this.pluginList.forEach(plugin => {
      plugin.inputTypes.forEach(inputType => {
        inputTypes.push(inputType)
      })
    })
    return inputTypes
  }

  getOutputTypes() {
    const outputTypes = [] as any[]
    this.pluginList.forEach(plugin => {
      plugin.outputTypes.forEach(outputType => {
        outputTypes.push(outputType)
      })
    })
    return outputTypes
  }
}

class ServerPluginManager extends PluginManager {
  pluginList: Array<ServerPlugin>
  constructor() {
    super()
    this.pluginList = new Array<ServerPlugin>()
  }
  
  getAgentStartMethods() {
    let agentStartMethods = {};
    (this.pluginList as ServerPlugin[]).forEach((plugin: ServerPlugin) => {
      if (plugin.agentMethods) {
        const obj = {}
        obj[plugin.name] = plugin.agentMethods.start
        agentStartMethods = { ...agentStartMethods, ...obj }
      }
    })
    return agentStartMethods
  }

  getAgentStopMethods() {
    let agentStopMethods = {};
    (this.pluginList as ServerPlugin[]).forEach((plugin: ServerPlugin) => {
      if (plugin.agentMethods) {
        const obj = {}
        obj[plugin.name] = plugin.agentMethods.stop
        agentStopMethods = { ...agentStopMethods, ...obj }
      }
    })
    return agentStopMethods
  }

  getServices() {
    const serviceList = [] as any[]
    (this.pluginList as ServerPlugin[]).forEach((plugin: ServerPlugin) => {
      Object.keys(plugin.services).forEach(key => {
        serviceList.push([key, plugin.services[key]])
      })
    })
    return serviceList
  }

  getServerInits() {
    let serverInits = {};
    (this.pluginList as ServerPlugin[]).forEach((plugin: ServerPlugin) => {
      if (plugin.serverInit) {
        const obj = {}
        obj[plugin.name] = plugin.serverInit
        serverInits = { ...serverInits, ...obj }
      }
    })
    return serverInits
  }

  getServerRoutes() {
    const serverRoutes = [] as any[]
    (this.pluginList as ServerPlugin[]).forEach((plugin: ServerPlugin) => {
      if (plugin.serverRoutes) {
        plugin.serverRoutes.forEach(route => {
          serverRoutes.push(route)
        })
      }
    })
    return serverRoutes
  }
}

export const pluginManager =
  typeof window !== 'undefined'
    ? new ClientPluginManager()
    : (new ServerPluginManager() as any)
