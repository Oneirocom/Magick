export class Plugin {
    name: string;
    nodes: any;
    services: any;
    windowComponents: []
    agentComponents: []
    serverInit?: Function;
    agentMethods?: {
        start: Function,
        stop: Function
    }
    serverRoutes?: Array<any>
    constructor({
        name,
        nodes,
        services,
        windowComponents,
        agentComponents,
        serverInit,
        agentMethods,
        serverRoutes
    }) {
        this.name = name;
        this.nodes = nodes;
        this.services = services;
        this.windowComponents = windowComponents;
        this.agentComponents = agentComponents;
        this.agentMethods = agentMethods;
        this.serverInit = serverInit;
        this.serverRoutes = serverRoutes;
        pluginManager.register(this)
    }
}

class PluginManager {
    pluginList: Array<Plugin>;
    componentList: Object;
    plugins
    constructor() {
        this.pluginList = new Array<Plugin>();
        (async () => {
            let plugins = (await import('./plugins')).default
            this.plugins = plugins;
        })()
    }

    register(plugin: Plugin) {
        this.pluginList.push(plugin)
    }
    /*
    Gets All Agent Components from all the registered plugins 
    */
    getAgentComponents() {
        let agentComp = []
        this.pluginList.forEach((plugin) => {
            plugin.agentComponents.forEach((component) => {
                agentComp.push(component)
            })
        })
        return agentComp
    }

    getAgentStartMethods() {
        let agentStartMethods = {}
        this.pluginList.forEach((plugin) => {
            if (plugin.agentMethods) {
                let obj = {}
                obj[plugin.name] = plugin.agentMethods.start
                agentStartMethods = { ...agentStartMethods, ...obj }
            }
        })
        console.log('getAgentStartMethods', agentStartMethods)
        return agentStartMethods
    }

    getAgentStopMethods() {
        let agentStopMethods = {}
        this.pluginList.forEach((plugin) => {
            if (plugin.agentMethods) {
                let obj = {}
                obj[plugin.name] = plugin.agentMethods.stop
                agentStopMethods = { ...agentStopMethods, ...obj }
            }
        })
        return agentStopMethods
    }

    getServerInits() {
        let serverInits = {}
        this.pluginList.forEach((plugin) => {
            if (plugin.serverInit) {
                let obj = {}
                obj[plugin.name] = plugin.serverInit
                serverInits = { ...serverInits, ...obj }
            }
        })
        return serverInits
    }


    getServerRoutes() {
        let serverRoutes = []
        this.pluginList.forEach((plugin) => {
            if (plugin.serverRoutes) {
                plugin.serverRoutes.forEach((route) => {
                    serverRoutes.push(route)
                })
            }
        })
        return serverRoutes
    }

    /*
    Gets All Services from all the registered plugins 
    */
    getServices() {
        let serviceList = []
        this.pluginList.forEach((plugin) => {
            Object.keys(plugin.services).forEach((key) => {
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

        this.pluginList.forEach((plugin) => {
            let plug_nodes = {}
            plugin.nodes.forEach((node) => {
                let id = Math.random().toString(36).slice(2, 7);
                let obj = {}
                obj[id] = () => new node()
                plug_nodes = { ...plug_nodes, ...obj }
            })
            nodes = { ...nodes, ...plug_nodes }
        })

        return nodes;
    }
}

export const pluginManager = new PluginManager()