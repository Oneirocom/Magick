import { redisPubsub } from './redis-pubsub'

describe('redisPubsub', () => {
  it('should work', () => {
    expect(redisPubsub()).toEqual('redis-pubsub')
  })
})
