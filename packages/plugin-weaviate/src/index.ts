import { Plugin } from "@magickml/engine";
import { EventDelete } from "./nodes/events/EventDelete";
import { EventQA } from "./nodes/events/EventQA";
import { EventRecall } from "./nodes/events/EventRecall";
import { EventStore } from "./nodes/events/EventStore";
// import { WeaviateWikipedia } from "./nodes/WeaviateWikipedia"; // need to fix to not load on client
import { EventsQAService } from "./services/eventsqa.class";
import { WeaviateService } from "./services/weaviate.class";
// import { initWeaviateClient } from "./utils/weaviateClient";
// import { wikipedia } from "./utils/wikipedia";
export * from "./nodes/events/EventDelete";
export * from "./nodes/events/EventStore";
export * from "./nodes/events/EventRecall";
export * from "./nodes/events/EventQA";

const WeaviatePlugin = new Plugin({
    name: 'WeaviatePlugin', 
    nodes: [ EventStore, EventRecall, EventQA, EventDelete, /*WeaviateWikipedia*/], 
    services: [['WeaviatePlugin',WeaviateService],['EventsQA',EventsQAService]], // TODO: should be key value object, not tuples array
    agentComponents: [], 
    windowComponents: [], 
    agentMethods: null,
    serverInit: () => {
        // const WEAVIATE_IMPORT_DATA = process?.env.WEAVIATE_IMPORT_DATA ?? false
        // initWeaviateClient(
        //     typeof WEAVIATE_IMPORT_DATA === 'string'
        //       ? WEAVIATE_IMPORT_DATA?.toLowerCase().trim() === 'true'
        //       : WEAVIATE_IMPORT_DATA
        //   )
    },
    serverRoutes: [/*wikipedia*/],
    setup: ()=>{console.log("Setting up Weaviate plugin...")}, 
    teardown: ()=>{console.log("Tearing down Weaviate plugin...")} })

export default WeaviatePlugin;