import { feathersClient } from './feathers-client'

describe('feathersClient', () => {
  it('should work', () => {
    expect(feathersClient()).toEqual('feathers-client')
  })
})
