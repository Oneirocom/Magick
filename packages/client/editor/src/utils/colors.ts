import { NodeSpecJSON } from '@magickml/behave-graph'

export type color =
  | 'red'
  | 'green'
  | 'lime'
  | 'purple'
  | 'blue'
  | 'gray'
  | 'white'
  | 'orange'

export const colors: Record<color, [string, string, string]> = {
  red: ['bg-orange-700', 'border-orange-700', 'text-white'],
  green: ['bg-green-600', 'border-green-600', 'text-white'],
  lime: ['bg-lime-500', 'border-lime-500', 'text-gray-900'],
  purple: ['bg-purple-500', 'border-purple-500', 'text-white'],
  blue: ['bg-cyan-600', 'border-cyan-600', 'text-white'],
  gray: ['bg-gray-500', 'border-gray-500', 'text-white'],
  white: ['bg-white', 'border-white', 'text-gray-700'],
  orange: ['bg-orange-500', 'border-orange-500', 'text-white'],
}

export const valueTypeColorMap: Record<string, string> = {
  flow: 'white',
  number: 'green',
  float: 'green',
  integer: 'lime',
  boolean: 'red',
  string: 'purple',
  array: 'orange',
  object: 'blue',
}

export const categoryColorMap: Record<NodeSpecJSON['category'], color> = {
  Event: 'red',
  Logic: 'green',
  Variable: 'purple',
  Query: 'purple',
  Action: 'blue',
  Flow: 'gray',
  Effect: 'lime',
  Time: 'gray',
  None: 'green',
}
