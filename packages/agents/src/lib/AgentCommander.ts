import EventEmitter from "events"
import type { Agent } from "packages/core/server/src/services/agents/agents.schema"
import { type PubSub, type MessageQueue } from '@magickml/server-core'
import { AGENT_RUN_JOB, AGENT_RUN_RESULT, AGENT_DELETE } from '@magickml/core'
import type { MagickSpellInput } from "@magickml/core"

type RunRootSpellArgs = {
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
    messageQueue: MessageQueue
}

export class AgentCommander extends EventEmitter {
    pubSub: PubSub
    messageQueue: MessageQueue

    constructor({
        pubSub,
        messageQueue
    }: AgentCommanderArgs) {
        super()
        this.pubSub = pubSub
        this.messageQueue = messageQueue
        this.messageQueue.initialize(AGENT_RUN_JOB)
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
        await this.messageQueue.addJob(AGENT_RUN_JOB, {
            agentId: agent.id,
            spellId: spellId || agent.rootSpellId,
            inputs,
            componentName,
            runSubspell,
            secrets,
            publicVariables
        })
    }

    async removeAgent(agentId: string) {
        await this.pubSub.emit(AGENT_DELETE, agentId)
    }
}
