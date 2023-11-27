import {
  CompletionProvider,
  MagickEditor,
  MagickNode,
  anySocket,
} from '@magickml/core'
import Rete from '@magickml/rete'

/**
 * Finds an object by its subtype within an array of CompletionProvider objects.
 *
 * @param subtype - The subtype to search for.
 * @param providers - An array of CompletionProvider objects.
 * @returns The found object, or undefined if not found.
 */
export const getProvidersBySubtype = (
  subtype: string,
  providers: CompletionProvider[]
) => providers.find(obj => obj.subtype === subtype)

/**
 * Converts a camelCase string to a title-cased string.
 *
 * @param input - The camelCase string.
 * @returns The title-cased string.
 */
export const cameltoTitle = (input?: string) => {
  return input
    ? input
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : ''
}

/**
 * Converts a title-cased string to a camelCase string.
 *
 * @param input - The title-cased string.
 * @returns The camelCase string.
 */
export const titleToCamel = (input?: string) => {
  return input
    ? input
        .split(' ')
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase()
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join('')
    : ''
}

/**
 * Handles adding and removing sockets from a node.
 *
 * @param node - The MagickNode to be updated.
 * @param inputSockets - Array of input sockets.
 * @param outputSockets - Array of output sockets.
 * @param editor - Optional MagickEditor instance.
 * @param lastSockets - Array of last known sockets for caching.
 */
export async function handleSocketChange(
  node: MagickNode,
  inputSockets: any[],
  outputSockets: any[],
  editor?: MagickEditor,
  lastSockets?: any[]
) {
  // Initialize connection cache and gather existing connections
  const connections = node.getConnections()
  const connectionCache = new Map()

  const allSockets = [...inputSockets, ...outputSockets]

  // Check if sockets have changed
  if (allSockets !== lastSockets) {
    // Remove outdated sockets and cache connections
    lastSockets?.map(socket => {
      if (node.outputs.has(socket.socket) || node.inputs.has(socket.socket)) {
        if (socket.socket === 'trigger') return socket
        connections.forEach(c => {
          if (c.output.key === socket.socket || c.input.key === socket.socket) {
            connectionCache.set(socket.socket, c)
            editor?.removeConnection(c)
          }
        })
        node.outputs.delete(socket.socket)
        node.inputs.delete(socket.socket)
      }
      return socket
    })

    // Update the node and redraw connections
    node.update()
    editor?.view.updateConnections({ node })

    // Add new input sockets
    inputSockets.map(async socket => {
      if (node.inputs.has(socket.socket)) return
      const input = new Rete.Input(socket.socket, socket.name, socket.type)
      node.addInput(input)
    })

    // Add new output sockets
    outputSockets.map(async socket => {
      if (node.outputs.has(socket.socket)) return
      const output = new Rete.Output(socket.socket, socket.name, socket.type)
      node.addOutput(output)
    })

    // Update the node and redraw connections again
    node.update()
    editor?.view.updateConnections({ node })

    // Restore connections if possible
    allSockets.forEach(socket => {
      const oldConnection = connectionCache.get(socket.socket)
      if (
        oldConnection &&
        (oldConnection.input.socket === socket.type ||
          oldConnection.input.socket === anySocket ||
          socket.type === anySocket)
      ) {
        editor?.connect(oldConnection.output, oldConnection.input)
      }
    })

    // Update the last known state of sockets
    lastSockets = allSockets
  }
}
