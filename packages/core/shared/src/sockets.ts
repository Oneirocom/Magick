import Rete from 'rete'

// TODO fix this very unmaintainable mapping
// this is a horrible hack and only temprorary tunil we have a rete schema migration system set up
// with the goal of changing the name of every socket to match the name of the variable.
// Used in the module manager utils addIO function

export type SocketNameType =
  | 'Any'
  | 'Number'
  | 'Boolean'
  | 'Array'
  | 'String'
  | 'Object'
  | 'Trigger'
  | 'Event'
  | 'Audio'
  | 'Embedding'
  | 'Document'

export type SocketType =
  | 'anySocket'
  | 'numberSocket'
  | 'booleanSocket'
  | 'arraySocket'
  | 'stringSocket'
  | 'objectSocket'
  | 'triggerSocket'
  | 'eventSocket'
  | 'audioSocket'
  | 'documentSocket'

export const socketNameMap: Record<SocketNameType, SocketType> = {
  'Any': 'anySocket',
  Number: 'numberSocket',
  Boolean: 'booleanSocket',
  Array: 'arraySocket',
  String: 'stringSocket',
  Object: 'objectSocket',
  Trigger: 'triggerSocket',
  Event: 'eventSocket',
  Audio: 'audioSocket',
  Document: 'documentSocket',
}

export const anySocket = new Rete.Socket('Any')
export const numberSocket = new Rete.Socket('Number')
export const booleanSocket = new Rete.Socket('Boolean')
export const arraySocket = new Rete.Socket('Array')
export const stringSocket = new Rete.Socket('String')
export const objectSocket = new Rete.Socket('Object')
export const triggerSocket = new Rete.Socket('Trigger')
export const eventSocket = new Rete.Socket('Event')
export const audioSocket = new Rete.Socket('Audio')
export const documentSocket = new Rete.Socket('Document')

const sockets = [
  numberSocket,
  booleanSocket,
  stringSocket,
  arraySocket,
  objectSocket,
  eventSocket,
  audioSocket,
  documentSocket,
]

sockets.forEach(socket => {
  anySocket.combineWith(socket)
  socket.combineWith(anySocket)
})
