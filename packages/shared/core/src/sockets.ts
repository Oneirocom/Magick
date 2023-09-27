import Rete from 'shared/rete'

// TODO: fix this very unmaintainable mapping
// this is a hack and only temporary until we have a rete schema migration system set up
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
  | 'Task'
  | 'Audio'
  | 'Image'
  | 'Document'
  | 'Embedding'

export type SocketType =
  | 'anySocket'
  | 'numberSocket'
  | 'booleanSocket'
  | 'arraySocket'
  | 'stringSocket'
  | 'objectSocket'
  | 'triggerSocket'
  | 'eventSocket'
  | 'taskSocket'
  | 'audioSocket'
  | 'imageSocket'
  | 'embeddingSocket'
  | 'taskSocket'
  | 'documentSocket'

export const socketNameMap: Record<SocketNameType, SocketType> = {
  Any: 'anySocket',
  Number: 'numberSocket',
  Boolean: 'booleanSocket',
  Array: 'arraySocket',
  String: 'stringSocket',
  Object: 'objectSocket',
  Trigger: 'triggerSocket',
  Event: 'eventSocket',
  Audio: 'audioSocket',
  Document: 'documentSocket',
  Embedding: 'embeddingSocket',
  Task: 'taskSocket',
  Image: 'imageSocket',
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
export const embeddingSocket = new Rete.Socket('Embedding')
export const taskSocket = new Rete.Socket('Task')
export const imageSocket = new Rete.Socket('Image')

const sockets = [
  numberSocket,
  booleanSocket,
  stringSocket,
  arraySocket,
  objectSocket,
  eventSocket,
  audioSocket,
  documentSocket,
  embeddingSocket,
  taskSocket,
  imageSocket,
]

sockets.forEach(socket => {
  anySocket.combineWith(socket)
  socket.combineWith(anySocket)
})
