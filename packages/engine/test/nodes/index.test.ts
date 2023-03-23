import { getNodes } from '../../src/lib/nodes'

jest.mock('@magickml/cost-calculator')

describe('Nodes', () => {
  it('should get all nodes', () => {
    const nodes = getNodes()
    expect(nodes.length).toBeGreaterThan(0)
  })
})