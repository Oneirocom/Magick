/* eslint-disable max-len */
import {
  DefaultLogger,
  ILogger,
  IRegistry,
  NodeDefinition,
  ValueTypeMap,
  getStringConversionsForValueType,
  memo,
} from '@magickml/behave-graph'
import Ajv from 'ajv'
import { ArrayValue } from './values/Array/Value'
import { ObjectValue } from './values/Object/Value'
import { AssocPath } from './values/Object/Assoc'
import { ArrayConstant } from './values/Array/Constant'
import { ObjectConstant } from './values/Object/Constant'
import { ArrayEqual } from './values/Array/Equal'
import { ObjectEqual } from './values/Object/Equal'
import { Concat, Concat3 } from './values/Array/Concat'
import { MergeDeep } from './values/Object/MergeDeep'
import { Path, PathAsInteger, PathAsString } from './values/Object/Path'
import { makeValidate } from './nodes/logic/Validate'
import { LogObject } from './nodes/debug/LogObject'
import { LogList } from './nodes/debug/LogArray'

export const getCoreValuesMap = memo<ValueTypeMap>(() => {
  const valueTypes = [ObjectValue, ArrayValue]
  return Object.fromEntries(
    valueTypes.map(valueType => [valueType.name, valueType])
  )
})

function getCoreStringConversions(values: ValueTypeMap): NodeDefinition[] {
  return Object.keys(getCoreValuesMap())
    .filter(name => name !== 'string')
    .flatMap(valueTypeName =>
      getStringConversionsForValueType({ values, valueTypeName })
    )
}

export const getCoreNodesMap = (logger: ILogger) => {
  const nodeDefinitions = [
    AssocPath,
    ArrayConstant,
    ArrayEqual,
    Concat,
    Concat3,
    ObjectConstant,
    ObjectEqual,
    MergeDeep,
    Path,
    PathAsInteger,
    PathAsString,
    LogObject.Description(logger),
    LogList.Description(logger),
    makeValidate(() => new Ajv()),
    ...getCoreStringConversions(getCoreValuesMap()),
  ]
  return Object.fromEntries(
    nodeDefinitions.map(nodeDefinition => [
      nodeDefinition.typeName,
      nodeDefinition,
    ])
  )
}

export function registerStructProfile(
  registry: IRegistry,
  logger: ILogger = new DefaultLogger()
) {
  // string converters

  const values = { ...registry.values, ...getCoreValuesMap() }
  return {
    values,
    nodes: { ...registry.nodes, ...getCoreNodesMap(logger) },
    dependencies: { ...registry.dependencies },
  }
}
