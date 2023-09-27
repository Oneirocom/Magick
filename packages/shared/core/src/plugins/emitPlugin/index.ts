import { WorkerOutputs } from 'rete/types/core/data'
import { MagickComponent } from '../../engine'

import {
  IRunContextEditor,
  MagickWorkerInputs,
  ModuleContext,
} from '../../types'

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
              nodeId: node.id,
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
