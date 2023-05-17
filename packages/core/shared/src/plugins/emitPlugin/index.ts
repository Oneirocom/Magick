import { WorkerOutputs } from 'rete/types/core/data'
import io from 'socket.io'
import { MagickComponent } from '../../engine'

import {
  IRunContextEditor,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
} from '../../types'
import { MagickConsole } from '../consolePlugin/MagickConsole'
import Agent from '../../agents/Agent'

export type EmitPluginArgs = {
  server?: boolean
  emit: (event: string, message: Record<string, unknown>) => void
}

export type SocketData = {
  output?: WorkerOutputs
  input?: MagickWorkerInputs
  error?: {
    message: string
    stack: string
  }
}

function install(
  editor: IRunContextEditor,
  // Need to better type the feathers client here
  { server = false, emit }: EmitPluginArgs
) {
  const subscriptionMap = new Map()

  editor.on(
    'componentregister',
    (component: MagickComponent<Promise<{ output: unknown } | void>>) => {
      const worker = component.worker

      component.worker = async (
        node,
        inputs,
        outputs,
        context: ModuleContext,
        ...args
      ) => {
        const currentSpell = context.currentSpell
        const event = `${node.id}`

        if (server) {
          try {
            const result = await worker.apply(component, [
              node,
              inputs,
              outputs,
              context,
              ...args,
            ])

            emit(event, {
              output: result,
              input: inputs,
            })

            return result
          } catch (err: any) {
            // this emits the error to be handled by the client plugin
            emit(event, {
              output: null,
              input: inputs,
              error: {
                message: err.message,
                stack: err.stack,
              },
            })

            throw err
          }
        }
      }
    }
  )
}

const defaultExport = {
  name: 'EmitPlugin',
  install,
}

export default defaultExport
