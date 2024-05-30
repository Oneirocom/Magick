import { URL } from 'url'
import core, { SYNC } from './core'
import redis from './redisAdapter'
const adaptors = {
  redis,
}

type InitOptions = {
  uri: string
  deserialize?: (data: string) => any
  serialize?: (data: any) => string
}

const init = (options: InitOptions) => {
  const { uri, deserialize, serialize } = options

  if (!uri) {
    throw new Error(
      'A `uri` option with the database connection string has to be provided to feathers-sync'
    )
  }

  if (deserialize && typeof deserialize !== 'function') {
    throw new Error(
      '`deserialize` option provided to feathers-sync is not a function'
    )
  }

  if (serialize && typeof serialize !== 'function') {
    throw new Error(
      '`serialize` option provided to feathers-sync is not a function'
    )
  }

  const { protocol } = new URL(uri)
  const name = protocol.substring(0, protocol.length - 1)
  const identifiedProtocolName = Object.keys(adaptors).filter(adaptor =>
    name.indexOf(adaptor) !== -1 ? adaptor : null
  )[0]
  const adapter = adaptors[
    identifiedProtocolName as keyof typeof adaptors
  ] as typeof redis

  if (!adapter) {
    throw new Error(`${name} is an invalid adapter (uri ${uri})`)
  }

  return adapter({
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    key: 'feathers-sync',
    ...options,
  })
}

export default init
export { core, redis, SYNC }
