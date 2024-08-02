#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { version as nitroVersion } from 'nitro/meta'

const main = defineCommand({
  meta: {
    name: 'nitro',
    description: 'Nitro CLI',
    version: nitroVersion,
  },
  subCommands: {
    dev: () => import('./commands/dev').then(r => r.default),
  },
})

runMain(main)
