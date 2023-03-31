// GENERATED 
// For more information about this file, see https://dove.feathersjs.com/guides/cli/.html
import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers';
import { Application as FeathersApplication } from '@feathersjs/koa';
import { ApplicationConfiguration } from './config/configuration';
import { SpellManager, UserSpellManager } from '@magickml/engine';

export { NextFunction };

/**
 * The types for app.get(name) and app.set(name).
 * @extends ApplicationConfiguration
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {}

/**
 * A mapping of service names to types. Will be extended in service files.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {}

/**
 * The application instance type that will be used everywhere else.
 * @extends FeathersApplication<ServiceTypes, Configuration>
 */
export interface Application extends FeathersApplication<ServiceTypes, Configuration> {
  userSpellManagers?: UserSpellManager;
}

/**
 * The context for hook functions, can be typed with a service class.
 * @template S - Type of the service. By default, it is set to `any`.
 * @extends FeathersHookContext<Application, S>
 */
export type HookContext<S = any> = FeathersHookContext<Application, S>;