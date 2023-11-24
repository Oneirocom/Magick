import { serverPluginManager } from './server/plugin-manager'

describe('serverPluginManager', () => {
  it('should work', () => {
    expect(serverPluginManager()).toEqual('server/plugin-manager')
  })
})
