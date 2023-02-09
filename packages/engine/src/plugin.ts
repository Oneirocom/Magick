export class Plugin {
    name: string;
    nodes: any;
    services:any;
    windowComponents: []
    agentComponents: []
    setup: Function;
    teardown: Function;
    agentMethods: {
        start: Function,
        stop: Function
    }
    constructor({
        name,
        nodes,
        services,
        windowComponents,
        agentComponents,
        setup,
        teardown,
        agentMethods
    }) {
        this.name = name;
        this.nodes = nodes;
        this.services = services;
        this.windowComponents = windowComponents;
        this.agentComponents = agentComponents;
        this.setup = setup;
        this.teardown = teardown;
        this.agentMethods = agentMethods;
        pluginManager.register(this)
    }
}

class PluginManager {
    static pluginList: Array<Plugin>;
    static componentList: Object;
    constructor(){
        PluginManager.pluginList = new Array<Plugin>();
    }

    register(plugin: Plugin){
        PluginManager.pluginList.push(plugin)
        plugin.setup()
    }
    /*
    Gets All Agent Components from all the registered plugins 
    */
    getAgentComponents(){
        let agentComp = []
        PluginManager.pluginList.forEach((plugin) => {
            plugin.agentComponents.forEach((component) => {
                agentComp.push(component)
            })
        })
        return agentComp
    }

    getAgentStartMethods(){
        let agentStartMethods = {}
        PluginManager.pluginList.forEach((plugin) => {
            let obj = {}
            obj[plugin.name] = plugin.agentMethods.start
            agentStartMethods = {...agentStartMethods, ...obj}
        })
        console.log('getAgentStartMethods', agentStartMethods)
        return agentStartMethods
    }

    getAgentStopMethods(){
        let agentStopMethods = {}
        PluginManager.pluginList.forEach((plugin) => {
            let obj = {}
            obj[plugin.name] = plugin.agentMethods.stop
            agentStopMethods = {...agentStopMethods, ...obj}
        })
        return agentStopMethods
    }

    /*
    Gets All Services from all the registered plugins 
    */
    getServices(){
        let services_list = []
        PluginManager.pluginList.forEach((plugin) => {
            plugin.services.forEach((service) => {
                services_list.push([plugin.name,service])
            })
        })
        return services_list
    }

    async teardown(plugin: Plugin){
        plugin.teardown()
        PluginManager.pluginList.pop()
    }
    /*
    Gets All Nodes from all the registered plugins 
    */
    getNodes(){
        let nodes = {}
        
        PluginManager.pluginList.forEach((plugin) => {
            
            let plug_nodes = {}
            plugin.nodes.forEach((node) => {
                let id = Math.random().toString(36).slice(2, 7);
                let obj = {}
                obj[id] = () => new node()
                plug_nodes = {...plug_nodes, ...obj}
            })
            nodes = {...nodes, ...plug_nodes}
        })

        return nodes;
    }
}

export const pluginManager = new PluginManager()