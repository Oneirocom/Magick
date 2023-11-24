import {
  DefaultLogger,
  IRegistry,
  ManualLifecycleEventEmitter,
  NodeDefinition,
  ValueType,
  ValueTypeMap,
  memo,
} from '@magickml/behave-graph'

export const coreRegistry: IRegistry = {
  values: {},
  nodes: {},
  dependencies: {
    ILogger: new DefaultLogger(),
    ILifecycleEventEmitter: new ManualLifecycleEventEmitter(),
  },
}

export class CoreRegistry {
  values: ValueType[] = []
  nodes: NodeDefinition[] = []
  dependencies: Record<string, any> = {}

  /**
   * Returns a dictionary of the behave values this plugin may provide
   * @returns A dictionary of the behave values
   */
  protected getPluginValues = memo<ValueTypeMap>(() => {
    const valueTypes = this.values
    return Object.fromEntries(
      valueTypes.map(valueType => [valueType.name, valueType])
    )
  })

  /**
   * Returns a dictionary of the behave nodes this plugin may provide
   * @returns A dictionary of the behave nodes
   */
  protected getPluginNodes = memo<Record<string, NodeDefinition>>(() => {
    const nodeDefinitions = this.nodes

    return Object.fromEntries(
      nodeDefinitions.map(nodeDefinition => [
        nodeDefinition.typeName,
        nodeDefinition,
      ])
    )
  })

  getRegistry(): IRegistry {
    return {
      values: this.getPluginValues(),
      nodes: this.getPluginNodes(),
      dependencies: this.dependencies,
    }
  }
}
