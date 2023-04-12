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

export type SocketPluginArgs = {
  server?: boolean
  socket?: io.Socket
  // Need to better type the feathers client here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any
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
  { server = false, socket, client }: SocketPluginArgs
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
        const event = `${currentSpell.id}-${node.id}`

        if (server) {
          try {
            const result = await worker.apply(component, [
              node,
              inputs,
              outputs,
              context,
              ...args,
            ])

            console.log('OUTPUTTING RESULT', result)

            socket?.emit(event, {
              output: result,
              input: inputs,
            })
            return result
          } catch (err: unknown) {
            if (err instanceof Error) {
              // handle errors here so they dont crash the process, and are communicated to the client
              socket?.emit(`${currentSpell.id}-${node.id}-error`, {
                error: {
                  message: err.message,
                  stack: err.stack,
                },
              })
              socket?.emit(`${currentSpell.id}-error`, {
                error: {
                  message: err.message,
                  stack: err.stack,
                },
              })
            } else {
              throw err
            }

            console.log('*******************Emitting event', event)
            socket?.emit(event, {
              output: { error: true },
            })
            // note: we may still want to throw the error here
            return console.error(err)
          }
        }

        if (client) {
          node.console = new MagickConsole({
            node: node as unknown as MagickNode,
            component,
            editor,
            server,
          })

          if (subscriptionMap.has(node.id)) return
          //  We may need to namespace this by spell as well
          const unsubscribe = client.io.on(
            event,
            async (socketData: SocketData) => {
              const newContext = {
                ...context,
                socketOutput: socketData.output,
                socketInput: socketData.input,
              }

              // make sure errors are handled in the flow.
              if (socketData?.error) {
                const error = new Error(socketData.error.message)
                error.stack = socketData.error.stack
                node.console?.error(error)
                return
              }

              await worker.apply(component, [
                node,
                socketData.input as MagickWorkerInputs,
                socketData.output as WorkerOutputs,
                newContext,
                ...args,
              ])
            }
          )

          subscriptionMap.set(node.id, unsubscribe)
        }
      }
    }
  )
}

const defaultExport = {
  name: 'socketPlugin',
  install,
}

export default defaultExport
