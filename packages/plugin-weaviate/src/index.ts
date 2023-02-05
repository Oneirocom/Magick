import { Plugin } from "@magickml/engine";
import { EventRecall } from "./nodes/EventRecall";
import { EventStore } from "./nodes/EventStore";
export * from "./nodes/EventDelete";
export * from "./nodes/EventStore";
export * from "./nodes/EventRecall";
export * from "./nodes/EventQA";

export const WeaviatePlugin = new Plugin({
    'name': 'WeaviatePlugin', 
    'nodes': [ EventStore, EventRecall], 
    'services': [], 
    'agentComponents' : [], 
    'windowComponents': [], 
    'setup': ()=>{console.log("HUII")}, 
    'teardown': ()=>{console.log("HUIII")} })