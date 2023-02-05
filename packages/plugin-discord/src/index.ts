//Creating two endpoint for discord
// 1. Input for Discord Input Node
//    1. EntityID
//    2. Content
//    3. Sender
import type { Params } from '@feathersjs/feathers'
import { Plugin } from "../../engine/src" // TODO: fix me
import { DiscordAgentWindow } from "./components/agent.component"
import { DiscordInput } from "./nodes/DiscordInput"
import { DiscordOutput } from "./nodes/DiscordOutput"

const DiscordPlugin = new Plugin({
  'name': 'DiscordPlugin', 
  'nodes': [DiscordInput, DiscordOutput], 
  'services': [], 
  'agentComponents' : [DiscordAgentWindow], 
  'windowComponents': [], 
  'setup': ()=>{console.log("DiscordPlugin")}, 
  'teardown': ()=>{console.log("DiscordPlugin")} })

export default DiscordPlugin;