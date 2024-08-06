import type { NitroApp } from "nitro/types";
import type { EmbedJSConfig } from "../../types";
import { RAGApplicationBuilder } from "@llm-tools/embedjs";

export async function initKnowledgeRuntime(nitroApp: NitroApp, config: EmbedJSConfig) {
  if (nitroApp?.knowledge?.ragApp) {
    console.warn("EmbedJS already initialized");
    return;
  }

  nitroApp.knowledge ={
    ragApp: new RAGApplicationBuilder(),
  };

  nitroApp.hooks.hook("close", async () => {
    // TODO: cleanup
  });
}