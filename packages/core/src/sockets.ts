import Rete from 'rete'

// TODO fix this very unmaintainable mapping
// this is a horrible hack and only temprorary tunil we have a rete schema migration system set up
// with the goal of changing the name of every socket to match the name of the variable.
// Used in the module manager utils addIO function

export type SocketNameType =
  | 'Any type'
  | 'Number'
  | 'Boolean'
  | 'Array'
  | 'String'
  | 'Object'
  | 'Trigger'
  | 'Agent'

export type SocketType =
  | 'anySocket'
  | 'numSocket'
  | 'booleanSocket'
  | 'arraySocket'
  | 'stringSocket'
  | 'objectSocket'
  | 'triggerSocket'
  | 'agentSocket'

export const socketNameMap: Record<SocketNameType, SocketType> = {
  'Any type': 'anySocket',
  Number: 'numSocket',
  Boolean: 'booleanSocket',
  Array: 'arraySocket',
  String: 'stringSocket',
  Object: 'objectSocket',
  Trigger: 'triggerSocket',
  Agent: 'agentSocket',
}

export const anySocket = new Rete.Socket('Any type')

export const numSocket = new Rete.Socket('Number')
export const booleanSocket = new Rete.Socket('Boolean')
export const arraySocket = new Rete.Socket('Array')
export const stringSocket = new Rete.Socket('String')
export const objectSocket = new Rete.Socket('Object')
export const triggerSocket = new Rete.Socket('Trigger')
export const agentSocket = new Rete.Socket('Agent')

const sockets = [
  numSocket,
  booleanSocket,
  stringSocket,
  arraySocket,
  objectSocket,
  agentSocket
]

sockets.forEach(socket => {
  anySocket.combineWith(socket)
  socket.combineWith(anySocket)
})
