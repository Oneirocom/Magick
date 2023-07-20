import EventEmitter from "events"
import type { Agent } from "packages/core/server/src/services/agents/agents.schema"
import { type PubSub, type MessageQueue } from '@magickml/server-core'
import { AGENT_RUN_JOB, AGENT_RUN_RESULT, AGENT_DELETE } from '@magickml/core'
import type { MagickSpellInput } from "@magickml/core"

export type RunRootSpellArgs = {
    agent: Agent,
    inputs: MagickSpellInput
    componentName?: string
    runSubspell?: boolean
    secrets?: Record<string, string>
    publicVariables?: Record<string, unknown>
    spellId?: string
}

interface AgentCommanderArgs {
    pubSub: PubSub
}

export class AgentCommander extends EventEmitter {
    pubSub: PubSub

    constructor({
        pubSub,
    }: AgentCommanderArgs) {
        super()
        this.pubSub = pubSub
    }

    async runSpellWithResponse(args: RunRootSpellArgs) {
        const { agent } = args
        await this.runSpell(args);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout'))
            }, 1200000)

            this.pubSub.subscribe(AGENT_RUN_RESULT(agent.id), (result) => {
                if (result.error) {
                    reject(result.error)
                } else {
                    //TODO: unsubscribe here
                    resolve(result)
                }
            })
        })
    }

    async runSpell({
        agent,
        inputs,
        componentName,
        runSubspell,
        secrets,
        publicVariables,
        spellId
    }: RunRootSpellArgs) {
        await this.pubSub.publish(AGENT_RUN_JOB(agent.id), JSON.stringify({
            agentId: agent.id,
            spellId: spellId || agent.rootSpellId,
            inputs,
            componentName,
            runSubspell,
            secrets,
            publicVariables
        }))
    }

    async removeAgent(agentId: string) {
        await this.pubSub.emit(AGENT_DELETE, agentId)
    }
}
