import { createAction, createAsyncNode, testAsyncNode } from 'plugins/factory'
import { EventPayload } from 'packages/server/plugin/src'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import LCMCLient from '../../services/lcmClient'
import { SLACK_ACTIONS } from '../../constants'
import { CredentialsManager } from 'server/credentials'

type Inputs = {
  flow: SocketDefinition
  name: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
  secret: SocketDefinition
}

const process = async (
  dependencies: {
    IEventStore: IEventStore
    credentialsManager: CredentialsManager
  },
  inputs: { name: string },
  write: (key: keyof Outputs, value: any) => void,
  commit: (key: string) => void,
  finished: () => void
) => {
  const event = dependencies.IEventStore.currentEvent() as EventPayload<any>

  try {
    const res = await dependencies.credentialsManager.retrieveAgentCredentials(
      event.agentId,
      inputs.name
    )

    if (!res) {
      throw new Error('Credentials not found')
    }

    write('secret', res)

    commit('flow')
    finished()

    console.log('committed flow')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to get credentials')
  }
}

export const getCredentials = testAsyncNode<
  Inputs,
  Outputs,
  ['IEventStore', 'credentialsManager']
>({
  eventName: SLACK_ACTIONS.generateImage,
  label: 'Get Credential',
  typeName: 'magick/getCredential',
  dependencyKeys: ['IEventStore', 'credentialsManager'],
  inputs: {
    flow: { valueType: 'flow' },
    name: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
    secret: { valueType: 'string' },
  },
  process,
})
