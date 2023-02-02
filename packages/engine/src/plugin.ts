export class Plugin {
    name: string;
    nodes: any;
    services: any;
    windowComponents: []
    agentComponents: []
    setup: Function;
    teardown: Function;
    constructor({
        name,
        nodes,
        services,
        windowComponents,
        agentComponents,
        setup,
        teardown
    }) {
        this.name = name;
        this.nodes = nodes;
        this.services = services;
        this.windowComponents = windowComponents;
        this.agentComponents = agentComponents;
        this.setup = setup;
        this.teardown = teardown;
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

    async teardown(plugin: Plugin){
        plugin.teardown()
        PluginManager.pluginList.pop()
    }

    getNodes(){
        let nodes = {}
        PluginManager.pluginList.forEach((plugin) => {
            nodes = {...nodes, ...plugin.nodes}
        })
        return nodes;
    }
}

export const pluginManager = new PluginManager()