

import { Service_Plugin } from './service_helper';


export class Plugin {
    _featherApplication: any;
    _route: [any];
    _schema: any;
    _name: string;
    _node: any;
    constructor(pluginsContext,featherApp){
        this._featherApplication = featherApp;
        this._name = pluginsContext.name;
        if(pluginsContext.node){this._node = pluginsContext.node }
        if(pluginsContext.route){this._route = pluginsContext.route }
        if(pluginsContext.schema){this._schema = pluginsContext.schema}
    }
    setup(){
        this._featherApplication.use(this._name, new Service_Plugin(this._route));
    }
    run(){}
    teardown(){
        
    }
}
