#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { registryProvider, downloadTemplate } from 'giget'

const templates = registryProvider(
  'https://raw.githubusercontent.com/oneirocom/magick/development/grimoire/src/cga/templates'
)

const main = defineCommand({
  meta: {
    name: 'grimoire',
    description: 'Grimoire CLI',
    version: '0.0.1',
  },
  run: async () => {
    const { source, dir } = await downloadTemplate('templates:starter', {
      providers: { templates },
    })

    console.log('source:', source)
    console.log('dir:', dir)
  },
})

runMain(main)
