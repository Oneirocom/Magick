import { sharedNodeSpec } from './shared/node-spec'

describe('sharedNodeSpec', () => {
  it('should work', () => {
    expect(sharedNodeSpec()).toEqual('shared/node-spec')
  })
})
