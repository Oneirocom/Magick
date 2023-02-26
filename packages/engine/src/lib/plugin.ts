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

export class Plugin {
  name: string
  nodes: any
  services: any
  windowComponents: any[]
  agentComponents: any[]
  inputTypes: any[]
  outputTypes: any[]
  serverInit?: Function
  agentMethods?: {
    start: Function
    stop: Function
  }
  clientRoutes?: Array<ClientRoute>
  serverRoutes?: Array<ServerRoute>
  startkey: any
  constructor({
    name,
    nodes = [],
    services = [],
    windowComponents = [],
    agentComponents,
    inputTypes = [],
    outputTypes = [],
    serverInit = null,
    agentMethods = {
      start: () => {
        console.log('starting plugin')
      },
      stop: () => {
        console.log('stopping plugin')
      }
    },
    clientRoutes = null,
    serverRoutes = null,
  }: {
    name: string
    nodes?: any
    services?: any
    windowComponents?: any[]
    agentComponents?: any[]
    serverInit?: Function
    agentMethods?: {
      start: Function
      stop: Function
    }
    inputTypes?: any[]
    outputTypes?: any[]
    clientRoutes?: Array<ClientRoute>
    serverRoutes?: Array<ServerRoute>
  }) {
    this.name = name
    this.nodes = nodes
    this.services = services
    this.windowComponents = windowComponents
    this.agentComponents = agentComponents
    this.agentMethods = agentMethods
    this.inputTypes = inputTypes
    this.outputTypes = outputTypes
    this.serverInit = serverInit
    this.clientRoutes = clientRoutes
    this.serverRoutes = serverRoutes
    pluginManager.register(this)
  }
}

class PluginManager {
  pluginList: Array<Plugin>
  componentList: Object
  plugins
  constructor() {
    this.pluginList = new Array<Plugin>()
    this.componentList = {}
  }

  register(plugin: Plugin) {
    this.pluginList.push(plugin)
  }
  /*
    Gets All Agent Components from all the registered plugins
    */
  // todo we could easily convert these methods into simple getters
  getAgentComponents() {
    let agentComp = []
    this.pluginList.forEach(plugin => {
      plugin.agentComponents.forEach(component => {
        agentComp.push(component)
      })
    })
    return agentComp
  }

  getAgentStartMethods() {
    let agentStartMethods = {}
    this.pluginList.forEach(plugin => {
      if (plugin.agentMethods) {
        let obj = {}
        obj[plugin.startkey] = plugin.agentMethods.start
        agentStartMethods = { ...agentStartMethods, ...obj }
      }
    })
    console.log('getAgentStartMethods', agentStartMethods)
    return agentStartMethods
  }

  getAgentStopMethods() {
    let agentStopMethods = {}
    this.pluginList.forEach(plugin => {
      if (plugin.agentMethods) {
        let obj = {}
        obj[plugin.name] = plugin.agentMethods.stop
        agentStopMethods = { ...agentStopMethods, ...obj }
      }
    })
    console.log('getAgentStopMethods', agentStopMethods)
    return agentStopMethods
  }

  getServerInits() {
    let serverInits = {}
    this.pluginList.forEach(plugin => {
      if (plugin.serverInit) {
        let obj = {}
        obj[plugin.name] = plugin.serverInit
        serverInits = { ...serverInits, ...obj }
      }
    })
    return serverInits
  }

  getClientRoutes() {
    let clientRoutes = [] as any[]
    this.pluginList.forEach(plugin => {
      if (plugin.clientRoutes) {
        plugin.clientRoutes.forEach(route => {
          clientRoutes.push(route)
        })
      }
    })
    return clientRoutes
  }

  getServerRoutes() {
    let serverRoutes = [] as any[]
    this.pluginList.forEach(plugin => {
      if (plugin.serverRoutes) {
        plugin.serverRoutes.forEach(route => {
          serverRoutes.push(route)
        })
      }
    })
    return serverRoutes
  }

  getInputTypes() {
    let inputTypes = []
    this.pluginList.forEach(plugin => {
      plugin.inputTypes.forEach(inputType => {
        inputTypes.push(inputType)
      })
    })
    return inputTypes
  }
  
  getOutputTypes() {
    let outputTypes = []
    this.pluginList.forEach(plugin => {
      plugin.outputTypes.forEach(outputType => {
        outputTypes.push(outputType)
      })
    })
    return outputTypes
  }

  /*
    Gets All Services from all the registered plugins
    */
  getServices() {
    let serviceList = [] as any[]
    this.pluginList.forEach(plugin => {
      Object.keys(plugin.services).forEach(key => {
        serviceList.push([key, plugin.services[key]])
      })
    })
    return serviceList
  }

  async teardown(plugin: Plugin) {
    this.pluginList.pop()
  }
  /*
    Gets All Nodes from all the registered plugins
    */
  getNodes() {
    let nodes = {}

    this.pluginList.forEach(plugin => {
      let plug_nodes = {}
      plugin.nodes.forEach(node => {
        let id = Math.random().toString(36).slice(2, 7)
        let obj = {}
        obj[id] = () => new node()
        plug_nodes = { ...plug_nodes, ...obj }
      })
      nodes = { ...nodes, ...plug_nodes }
    })

    return nodes
  }
}

export const pluginManager = new PluginManager()
