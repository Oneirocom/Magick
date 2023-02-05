import { Plugin } from "@magickml/engine";
import { EventRecall } from "./nodes/EventRecall";
import { EventStore } from "./nodes/EventStore";
export * from "./nodes/EventDelete";
export * from "./nodes/EventStore";
export * from "./nodes/EventRecall";
export * from "./nodes/EventQA";

const WeaviatePlugin = new Plugin({
    name: 'WeaviatePlugin', 
    nodes: [ EventStore, EventRecall], 
    services: [], // TODO: move event services here
    agentComponents: [], 
    windowComponents: [], // TODO: move event view here
    setup: ()=>{console.log("HUII")}, 
    teardown: ()=>{console.log("HUIII")} })

export default WeaviatePlugin;