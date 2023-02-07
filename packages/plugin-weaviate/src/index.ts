import { Plugin } from "@magickml/engine";
import { EventDelete } from "./nodes/EventDelete";
import { EventQA } from "./nodes/EventQA";
import { EventRecall } from "./nodes/EventRecall";
import { EventStore } from "./nodes/EventStore";
import { EventsQAService } from "./services/eventsqa.class";
import { WeaviateService } from "./services/weaviate.class";
export * from "./nodes/EventDelete";
export * from "./nodes/EventStore";
export * from "./nodes/EventRecall";
export * from "./nodes/EventQA";

const WeaviatePlugin = new Plugin({
    name: 'WeaviatePlugin', 
    nodes: [ EventStore, EventRecall, EventQA, EventDelete], 
    services: [['WeaviatePlugin',WeaviateService],['EventsQA',EventsQAService]],
    agentComponents: [], 
    windowComponents: [], 
    setup: ()=>{console.log("HUII")}, 
    teardown: ()=>{console.log("HUIII")} })

export default WeaviatePlugin;