import { Plugin } from "@magickml/engine";
import { EventDelete } from "./nodes/EventDelete";
import { EventQA } from "./nodes/EventQA";
import { EventRecall } from "./nodes/EventRecall";
import { EventStore } from "./nodes/EventStore";
// import { WeaviateWikipedia } from "./nodes/WeaviateWikipedia"; // need to fix to not load on client
import { EventsQAService } from "./services/eventsqa.class";
import { WeaviateService } from "./services/weaviate.class";
import { initWeaviateClient } from "./utils/weaviateClient";
// import { wikipedia } from "./utils/wikipedia";
export * from "./nodes/EventDelete";
export * from "./nodes/EventStore";
export * from "./nodes/EventRecall";
export * from "./nodes/EventQA";

const WeaviatePlugin = new Plugin({
    name: 'WeaviatePlugin', 
    nodes: [ EventStore, EventRecall, EventQA, EventDelete, /*WeaviateWikipedia*/], 
    services: [['WeaviatePlugin',WeaviateService],['EventsQA',EventsQAService]],
    agentComponents: [], 
    windowComponents: [], 
    agentMethods: null,
    serverInit: () => {
        const WEAVIATE_IMPORT_DATA = process?.env.WEAVIATE_IMPORT_DATA
        initWeaviateClient(
            typeof WEAVIATE_IMPORT_DATA === 'string'
              ? WEAVIATE_IMPORT_DATA?.toLowerCase().trim() === 'true'
              : WEAVIATE_IMPORT_DATA
          )
    },
    serverRoutes: [/*wikipedia*/],
    setup: ()=>{console.log("Setting up Weaviate plugin...")}, 
    teardown: ()=>{console.log("Tearing down Weaviate plugin...")} })

export default WeaviatePlugin;