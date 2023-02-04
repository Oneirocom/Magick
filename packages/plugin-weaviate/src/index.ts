import { Plugin, pluginManager } from "@magickml/engine";

export * from "./nodes/EventDelete";
export * from "./nodes/EventStore";
export * from "./nodes/EventRecall";
export * from "./nodes/EventQA";

export const WeaviatePlugin = new Plugin("weaviatePlugin", {
    name: "weaviatePlugin",
    description: "weaviatePlugin",
    version: "0.0.1"
});