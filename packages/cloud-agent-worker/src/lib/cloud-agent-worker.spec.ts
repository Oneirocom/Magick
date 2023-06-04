import { cloudAgentWorker } from './cloud-agent-worker'

describe('cloudAgentWorker', () => {
  it('should work', () => {
    expect(cloudAgentWorker()).toEqual('cloud-agent-worker')
  })
})
