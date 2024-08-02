#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'grimoire',
    description: 'Grimoire CLI',
    version: '0.0.1',
  },
  subCommands: {
    dev: () => import('./commands/dev').then(r => r.default),
  },
})

runMain(main)
