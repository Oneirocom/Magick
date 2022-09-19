process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import { Agent, NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { agentSocket, stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Cache Manager Delete is used to delete data from the cache manager'

export class CacheManagerDelete extends ThothComponent<void> {
  constructor() {
    super('Cache Manager Delete')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const keyInput = new Rete.Input('key', 'Key', stringSocket)
    const agentInput = new Rete.Input('agent', 'Agent', agentSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(keyInput)
      .addInput(agentInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const key = inputs['key'][0] as string
    const agent = inputs['agent'][0] as Agent

    await axios.delete(`${process.env.REACT_APP_API_URL}/cache_manager`, {
      params: {
        key: key,
        agent: agent.agent,
      },
    })
  }
}
