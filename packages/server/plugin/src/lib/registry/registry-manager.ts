import { IRegistry, NodeDefinition, ValueTypeMap } from '@magickml/behave-graph'
import { SpellCaster } from 'server/grimoire'

export class PluginRegistryManager {
  protected getPluginValues: () => ValueTypeMap | Promise<ValueTypeMap>
  protected getPluginNodes: () =>
    | Record<string, NodeDefinition>
    | Promise<Record<string, NodeDefinition>>
  protected getDependencies: (
    spellCaster: SpellCaster
  ) => Record<string, any> | Promise<Record<string, any>>

  constructor(
    getPluginValues: () => ValueTypeMap,
    getPluginNodes: () => Record<string, NodeDefinition>,
    getDependencies: (
      spellCaster: SpellCaster
    ) => Record<string, any> | Promise<Record<string, any>>
  ) {
    this.getPluginValues = getPluginValues
    this.getPluginNodes = getPluginNodes
    this.getDependencies = getDependencies
  }

  /**
   * Optional method to be overridden by plugins to provide an additional registry when needed.
   */
  async provideRegistry(registry: IRegistry): Promise<IRegistry> {
    return registry
  }

  /**
   * Returns a registry object merged with the plugin's specific registry.
   * @param existingRegistry An existing registry to merge with the plugin's registry.
   * @param spellCaster The spell caster instance.
   * @returns A merged registry object.
   */
  async getRegistry(
    existingRegistry: IRegistry,
    spellCaster: SpellCaster
  ): Promise<IRegistry> {
    const pluginValues = await this.getPluginValues()
    const pluginNodes = await this.getPluginNodes()
    const pluginDependencies = await this.getDependencies(spellCaster)

    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }

    return await this.provideRegistry(registry)
  }

  /**
   * Returns a registry object for the node specification.
   * @param existingRegistry An existing registry to merge with the plugin's registry.
   * @returns A merged registry object for the node specification.
   */
  async getRegistryForNodeSpec(
    existingRegistry: IRegistry
  ): Promise<IRegistry> {
    const pluginValues = await this.getPluginValues()
    const pluginNodes = await this.getPluginNodes()

    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: {},
    }

    return await this.provideRegistry(registry)
  }
}
