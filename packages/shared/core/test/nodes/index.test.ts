import { getNodes } from '../../src/nodes'

describe('Nodes', () => {
  it('should get all nodes', () => {
    const nodes = getNodes()
    expect(nodes.length).toBeGreaterThan(0)
  })
})
