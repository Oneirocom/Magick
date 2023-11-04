import { serverEventTracker } from './server/event-tracker'

describe('serverEventTracker', () => {
  it('should work', () => {
    expect(serverEventTracker()).toEqual('server/event-tracker')
  })
})
