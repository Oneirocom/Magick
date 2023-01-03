import io from 'socket.io'

import { IRunContextEditor } from '../../../types'

function install(
  editor: IRunContextEditor,
  // Need to better type the feathers client here
  {
    server = false,
    socket,
    client,
  }: { server?: boolean; socket?: io.Socket; client?: any }
) {
  const subscriptionMap = new Map()

  editor.on('componentregister', (component: any) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, context, ...args) => {
      if (server) {
        const result = await worker.apply(component, [
          node,
          inputs,
          outputs,
          context,
          ...args,
        ])

        socket?.emit(`${node.id}`, {
          output: result?.output,
        })
        return result
      }

      if (client) {
        if (subscriptionMap.has(node.id)) return
        //  We may need to namespace this by spell as well
        const unsubscribe = client.io.on(
          node.id,
          async (socketData: unknown) => {
            const newContext = {
              ...context,
              socketOutput: socketData,
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
  })
}

const defaultExport = {
  name: 'socketPlugin',
  install,
}

export default defaultExport
