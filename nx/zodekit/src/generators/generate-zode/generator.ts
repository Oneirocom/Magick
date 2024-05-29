import { Tree } from '@nx/devkit'
import { GenerateZodeGeneratorSchema } from './schema'
import { generateZodClientFromOpenAPI } from 'openapi-zod-client'
import consola from 'consola'
import { getHandlebars } from './get-handlebars'

export async function generateZodeGenerator(
  tree: Tree,
  options: GenerateZodeGeneratorSchema
) {
  consola.info('Generating Nodes from OpenAPI spec:', options.url)

  // Fetch and parse the OpenAPI document
  const response = await fetch(options.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI document from ${options.url}`)
  }
  const openApiDoc = await response.json()

  // Write default schemas with zodios client
  await generateZodClientFromOpenAPI({
    openApiDoc,
    distPath: `./packages/zode/src/lib/generated/${options.name}/schema.ts`,
    disableWriteToFile: false,
    templatePath:
      './nx/zodekit/src/generators/generate-zode/schema-template.hbs',
    options: {
      apiClientName: options.name,
    },
  })

  consola.success(
    'Generated Schemas and Zodios client from OpenAPI spec:',
    options.url
  )

  // Write magick node spec
  await generateZodClientFromOpenAPI({
    openApiDoc,
    distPath: `./packages/zode/src/lib/generated/${options.name}/nodes.ts`,
    disableWriteToFile: false,
    templatePath: './nx/zodekit/src/generators/generate-zode/node-template.hbs',
    handlebars: getHandlebars(),
    options: {
      apiClientName: options.name,
    },
  })

  consola.success('Generated Magick nodes from OpenAPI spec:', options.url)
}

export default generateZodeGenerator
