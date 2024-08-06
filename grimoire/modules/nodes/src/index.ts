import { defineNovaModule } from "@gtc-nova/kit";
import { nodeFeatures, type NodeFeatures } from "./features";

export const nodeModule = defineNovaModule<NodeFeatures>({
  name: "nodes",
  features: nodeFeatures,
  featureTypeFunctions: {
    nodes: () => {
      console.log("nodes");
    },
  },
  pluginsDir: "./../src/runtime/plugins",
  metaUrl: import.meta.url,
  hooks: [],
});

export type * from "./types";