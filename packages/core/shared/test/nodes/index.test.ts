import { getNodes } from '../../src/lib/nodes'

describe('Nodes', () => {
  it('should get all nodes', () => {
    const nodes = getNodes()
    expect(nodes.length).toBeGreaterThan(0)
  })
})