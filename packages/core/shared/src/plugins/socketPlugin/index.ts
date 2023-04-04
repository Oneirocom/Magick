import io from 'socket.io'
import { MagickComponent } from '../../engine'

import { EngineContext, IRunContextEditor, MagickNode } from '../../types'
import { MagickConsole } from '../consolePlugin/MagickConsole'

export type SocketPluginArgs = {
  server?: boolean
  socket?: io.Socket
  // Need to better type the feathers client here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any
}

export type SocketData = {
  output?: unknown
  error?: {
    message: string
    stack: string
  }
}

type Context = {
  context: EngineContext
  currentSpell: {
    id: string
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
        context: Context,
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
            })
            return result
          } catch (err: unknown) {
            console.log('CAUGHT ERROR')
            console.log(err)
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
                inputs,
                outputs,
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
