import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, readProjectConfiguration } from '@nx/devkit'

import { generateZodeGenerator } from './generator'
import { GenerateZodeGeneratorSchema } from './schema'

describe('generate-zode generator', () => {
  let tree: Tree
  const options: GenerateZodeGeneratorSchema = { name: 'test' }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generateZodeGenerator(tree, options)
    const config = readProjectConfiguration(tree, 'test')
    expect(config).toBeDefined()
  })
})
