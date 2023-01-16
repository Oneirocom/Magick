import { Application as FeathersApplication } from '@feathersjs/express'
import { SpellManager } from '@magickml/core'
import { ApplicationConfiguration } from './configuration'
import { SpellRunner } from './services/spell-runner/spell-runner.class'

// The types for app.get(name) and app.set(name)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {}

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {
  ['spell-runner']: SpellRunner
}

export interface Application
  extends FeathersApplication<ServiceTypes, Configuration> {
  userSpellManagers?: Map<string, SpellManager>
}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
