import type { FromSchema } from '@feathersjs/schema'
import { getComponents } from 'packages/engine/src/components';
import { Plugin } from './plugin';

export class Plugin_Manager {
    static pluginList: Array<Plugin>;
    static componentList: Object;
    static plugins_mounted: Boolean;
    constructor(){
        Plugin_Manager.pluginList = new Array<Plugin>();
        Plugin_Manager.plugins_mounted = false;
    }

    register(plugin: Plugin){
        Plugin_Manager.pluginList.push(plugin)
    }

    async teardown(plugin: Plugin){
        plugin.teardown()
        Plugin_Manager.pluginList.pop()
    }

    getAllComponents(){
        return new Promise((resolve, reject) => {
            Plugin_Manager.pluginList.forEach((plugin) => {
                Plugin_Manager.componentList = {...Plugin_Manager.componentList, ...plugin._node}
            })
            if (Plugin_Manager.pluginList.length === Object.keys(Plugin_Manager.componentList).length) {
                //Plugin_Manager.componentList = getComponents(Plugin_Manager.componentList)
                console.log(Plugin_Manager.componentList)
                Plugin_Manager.plugins_mounted = true;
                resolve(Plugin_Manager.componentList)
            } else {
                const errorObject = {
                    msg: 'Few Plugins Were not mounted',
                 }
                reject(errorObject)
            }
        })
    }
    
    static async getComponents(){
        //await until(_ => Plugin_Manager.plugins_mounted == true);
        return Plugin_Manager.componentList
    }
}

abstract class Service {
    async find(): Promise<void> {};
    async get(): Promise<void> {};
    async create(): Promise<void> {};
    async update(): Promise<void> {};
    async patch(): Promise<void> {};
    async remove(): Promise<void> {};
}





export class Service_Plugin<Service> extends Service{
    protected arr_store: any[];
    
    constructor(
        params
      ){
        super()
        const {create, find, get, update, patch, remove} = params
        this.create = create
        if(find !== null)this.find = find
        if(get !== null) this.get = get
        if(update !== null)this.update = update
        if(patch !== null)this.patch = patch
        if(remove !== null)this.remove = remove
        this.arr_store = []
    }

    alter_store(value: any){
        this.arr_store = value
    }
}
