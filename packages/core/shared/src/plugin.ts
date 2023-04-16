import { FC, LazyExoticComponent } from 'react'
import { MagickComponentArray } from './engine'
import { CompletionProvider, Route, SpellInterface } from './types'

export type PluginSecret = {
  name: string
  key: string
  global?: boolean
  getUrl?: string
}

export type PluginDrawerItem = {
  path: string
  icon: FC
  text: string
}

export type PluginClientRoute = {
  path: string
  component: FC
  exact?: boolean
  plugin: string
}

export type PluginServerRoute = Route

// inputTypes: [
//   { name: 'Discord (Voice)', trigger: true, socket: eventSocket},
//   { name: 'Discord (Text)', trigger: true, socket: eventSocket },
// ],
// outputTypes: [
//   { name: 'Discord (Voice)', trigger: false, socket: eventSocket },
//   { name: 'Discord (Text)', trigger: false, socket: eventSocket },
// ],
// secrets: [{
//   name: 'Discord API Key',
//   key: 'discord_api_key',
//   global: false
// }]
export type PluginIOType = {
  name: string
  inspectorControls?: any[]
  sockets?: any[]
  defaultResponseOutput?: string
  handler?: ({ output, agent, event }) => Promise<void>
}

type PluginConstuctor = {
  name: string
  nodes?: MagickComponentArray
  inputTypes?: PluginIOType[]
  outputTypes?: PluginIOType[]
  secrets?: PluginSecret[]
  completionProviders?: CompletionProvider[]
}
class Plugin {
  name: string
  nodes: MagickComponentArray
  inputTypes: PluginIOType[]
  outputTypes: PluginIOType[]
  secrets: PluginSecret[]
  completionProviders: CompletionProvider[]
  constructor({
    name,
    nodes = [],
    inputTypes = [],
    outputTypes = [],
    secrets = [],
    completionProviders = [],
  }: PluginConstuctor) {
    this.name = name
    this.nodes = nodes
    this.inputTypes = inputTypes
    this.outputTypes = outputTypes
    this.secrets = secrets
    this.completionProviders = completionProviders
  }
}

export type PageLayout = LazyExoticComponent<() => JSX.Element> | null
export class ClientPlugin extends Plugin {
  agentComponents: FC[]
  drawerItems?: Array<PluginDrawerItem>
  clientPageLayout?: PageLayout
  clientRoutes?: Array<PluginClientRoute>
  spellTemplates?: SpellInterface[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectTemplates?: any[]
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
    completionProviders = [],
    spellTemplates = [],
    projectTemplates = [],
  }: PluginConstuctor & {
    agentComponents?: FC<any>[]
    clientPageLayout?: PageLayout
    clientRoutes?: Array<PluginClientRoute>
    drawerItems?: Array<PluginDrawerItem>
    spellTemplates?: SpellInterface[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projectTemplates?: any[]
  }) {
    super({
      name,
      nodes,
      inputTypes,
      outputTypes,
      secrets,
      completionProviders,
    })
    this.clientPageLayout = clientPageLayout
    this.agentComponents = agentComponents
    this.clientRoutes = clientRoutes
    this.drawerItems = drawerItems
    this.spellTemplates = spellTemplates
    this.projectTemplates = projectTemplates
    pluginManager.register(this)
  }
}

export type ServerInit = () => Promise<void> | null | void
export type ServerInits = Record<string, ServerInit>
export class ServerPlugin extends Plugin {
  services: ((app: any) => void)[]
  serverInit?: ServerInit
  agentMethods?: {
    start: (args) => Promise<void> | void
    stop: (args) => Promise<void> | void
  }
  serverRoutes?: Array<PluginServerRoute>
  constructor({
    name,
    nodes = [],
    services = [],
    inputTypes = [],
    outputTypes = [],
    serverInit = () => null,
    agentMethods = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      start: () => { /* null */},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stop: () => { /* null */},
    },
    serverRoutes = [],
    secrets = [],
    completionProviders = [],
  }: PluginConstuctor & {
    services?: ((app: any) => void)[]
    serverInit?: ServerInit
    agentMethods?: {
      start: (args) => Promise<void> | void
      stop: (args) => Promise<void> | void
    }
    serverRoutes?: Array<PluginServerRoute>
  }) {
    super({
      name,
      nodes,
      inputTypes,
      outputTypes,
      secrets,
      completionProviders,
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
  componentList: Record<string, never> // TODO: componentList is never used, remove it?
  plugins
  constructor() {
    this.pluginList = new Array<ClientPlugin | ServerPlugin>()
    this.componentList = {}
  }

  register(plugin: ClientPlugin | ServerPlugin) {
    this.pluginList.push(plugin)
  }

  getInputTypes() {
    const inputTypes: PluginIOType[] = []
    this.pluginList.forEach(plugin => {
      plugin.inputTypes.forEach(inputType => {
        inputTypes.push(inputType)
      })
    })
    console.log('inputTypes', inputTypes)
    return inputTypes
  }

  getOutputTypes() {
    const outputTypes: PluginIOType[] = []
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
      plugin.nodes.forEach((node: any) => {
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
    const secrets: PluginSecret[] = []
    this.pluginList.forEach(plugin => {
      plugin.secrets.forEach(secret => {
        if (global && !secret.global) return
        secrets.push(secret)
      })
    })
    return secrets
  }

  getCompletionProviders(
    type: string | null = null,
    subtypes: null | string[] = null
  ): CompletionProvider[] {
    const completionProviders: CompletionProvider[] = []
    this.pluginList.forEach(plugin => {
      plugin.completionProviders.forEach(provider => {
        if (type && provider.type !== type) return
        if (subtypes && !subtypes.includes(provider.subtype)) return
        completionProviders.push(provider)
      })
    })
    return completionProviders
  }
  getCompletionProvidersWithSecrets(
    type: string | null = null,
    subtypes: null | string[] = null
  ): any {
    const completionProviders: CompletionProvider[] = []
    const secrets: any = [];
    this.pluginList.forEach(plugin => {
      plugin.completionProviders.forEach(provider => {
        if (type && provider.type !== type) return
        if (subtypes && !subtypes.includes(provider.subtype)) return
        completionProviders.push(provider)
        secrets.push(plugin.secrets)
      })
    })
    return [completionProviders, secrets]
  }
}

export class ClientPluginManager extends PluginManager {
  declare pluginList: Array<ClientPlugin>
  constructor() {
    super()
    this.pluginList = new Array<ClientPlugin>()
  }

  getAgentComponents() {
    const agentComp: FC[] = []
    ;(this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      plugin.agentComponents.forEach(component => {
        agentComp.push(component)
      })
    })
    return agentComp
  }

  getSpellTemplates() {
    const spellTemplates = [] as SpellInterface[]
    ;(this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      plugin.spellTemplates?.forEach(spellTemplate => {
        spellTemplates.push(spellTemplate)
      })
    })
    return spellTemplates
  }

  getProjectTemplates() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectTemplates = [] as any[]
    ;(this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      plugin.projectTemplates?.forEach(projectTemplate => {
        projectTemplates.push(projectTemplate)
      })
    })
    return projectTemplates
  }

  getClientRoutes() {
    const clientRoutes: PluginClientRoute[] = []
    ;(this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
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
    }, [] as { plugin: string; routes: PluginClientRoute[]; layout?: PageLayout }[])

    pluginRoutesGrouped.forEach(pluginRouteGroup => {
      const ClientPageLayout =
        (pluginManager as ClientPluginManager).getClientPageLayout(
          pluginRouteGroup.plugin
        ) || null
      pluginRouteGroup.layout = ClientPageLayout
    })
    return pluginRoutesGrouped as {
      plugin: string
      routes: PluginClientRoute[]
      layout: PageLayout
    }[]
  }

  getClientPageLayout(p) {
    const plugin = this.pluginList.filter(
      plugin => plugin.name === p
    )[0] as ClientPlugin

    return plugin.clientPageLayout
  }

  getDrawerItems() {
    const drawerItems = [] as (PluginDrawerItem & { plugin: string })[]
    ;(this.pluginList as ClientPlugin[]).forEach((plugin: ClientPlugin) => {
      if (plugin.drawerItems) {
        plugin.drawerItems.forEach(drawerItem => {
          drawerItems.push({ ...drawerItem, plugin: plugin.name })
        })
      }
    })
    return drawerItems
  }

  getInputByName() {
    const inputTypes = {}
    this.pluginList.forEach(plugin => {
      inputTypes[plugin.name] = plugin.inputTypes
    })
    return inputTypes
  }

  getPlugins() {
    const pluginList = {}
    this.pluginList.forEach(plugin => {
      pluginList[plugin.name] = plugin
    })
    return pluginList
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAgentStartMethods(): Record<string, (args: any) => void | Promise<void>> {
    return {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAgentStopMethods(): Record<string, (args: any) => void | Promise<void>> {
    return {}
  }
  getServices() {
    const serviceList = [] as [string, (app: any) => void][]
    return serviceList
  }
  getServerInits() {
    const serverInits: ServerInits = {}
    return serverInits
  }

  getServerRoutes() {
    const serverRoutes = [] as PluginServerRoute[]
    return serverRoutes
  }
}

export class ServerPluginManager extends PluginManager {
  declare pluginList: Array<ServerPlugin>
  constructor() {
    super()
    this.pluginList = new Array<ServerPlugin>()
  }

  getAgentStartMethods() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let agentStartMethods: Record<string, (args: any) => void | Promise<void>> =
      {}
    this.pluginList.forEach((plugin: ServerPlugin) => {
      if (plugin.agentMethods) {
        const obj = {}
        obj[plugin.name] = plugin.agentMethods.start
        agentStartMethods = { ...agentStartMethods, ...obj }
      }
    })
    return agentStartMethods
  }

  getAgentStopMethods() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let agentStopMethods: Record<string, (args: any) => void | Promise<void>> =
      {}
    this.pluginList.forEach((plugin: ServerPlugin) => {
      if (plugin.agentMethods) {
        const obj = {}
        obj[plugin.name] = plugin.agentMethods.stop
        agentStopMethods = { ...agentStopMethods, ...obj }
      }
    })
    return agentStopMethods
  }

  getServices() {
    const serviceList = [] as [string, (app: any) => void][]
    this.pluginList.forEach((plugin: ServerPlugin) => {
      Object.keys(plugin.services).forEach(key => {
        serviceList.push([key, plugin.services[key]])
      })
    })
    return serviceList
  }

  getServerInits() {
    let serverInits: ServerInits = {}
    this.pluginList.forEach((plugin: ServerPlugin) => {
      if (plugin.serverInit) {
        const obj = {}
        obj[plugin.name] = plugin.serverInit
        serverInits = { ...serverInits, ...obj }
      }
    })
    return serverInits
  }

  getServerRoutes() {
    const serverRoutes = [] as PluginServerRoute[]
    this.pluginList.forEach((plugin: ServerPlugin) => {
      if (plugin.serverRoutes) {
        plugin.serverRoutes.forEach(route => {
          serverRoutes.push(route)
        })
      }
    })
    return serverRoutes
  }
}

export const pluginManager: ClientPluginManager | ServerPluginManager =
  typeof window !== 'undefined'
    ? new ClientPluginManager()
    : new ServerPluginManager()
