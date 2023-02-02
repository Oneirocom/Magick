import { EventQA } from "../plugins/discordPlugin/nodes/EventQA";

export * from "../plugins/discordPlugin/agent_options/agent.component";

export const plugin_nodes = {
    eventqa: ()=>new EventQA()
}


