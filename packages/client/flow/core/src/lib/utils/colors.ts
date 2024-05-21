"use client";
import { NodeSpecJSON } from '@magickml/behave-graph'
import { AgentIcon, StarIcon } from '@magickml/icons'

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
  red: ['bg-rose-700', 'border-rose-700', 'text-white'],
  green: ['bg-green-600', 'border-green-600', 'text-white'],
  lime: ['bg-lime-500', 'border-lime-500', 'text-gray-900'],
  purple: ['bg-violet-700', 'border-violet-700', 'text-white'],
  blue: ['bg-sky-500', 'border-sky-500', 'text-white'],
  gray: ['bg-gray-500', 'border-gray-500', 'text-white'],
  white: ['bg-white', 'border-white', 'text-gray-700'],
  orange: ['bg-orange-700', 'border-orange-700', 'text-white'],
}

export const colorHexMap: Record<color, string> = {
  red: '#BE123C',
  green: '#16A34A',
  lime: '#84CC16',
  purple: '#6D28D9',
  blue: '#0EA5E9',
  gray: '#6B7280',
  white: '#FFFFFF',
  orange: '#C2410C',
};


export const valueTypeColorMap: Record<string, color> = {
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
  Flow: 'orange',
  Effect: 'lime',
  Time: 'purple',
  None: 'green',
}

export const categoryIconMap: Record<NodeSpecJSON['category'], any> = {
  Event: StarIcon,
  Logic: AgentIcon,
  Variable: AgentIcon,
  Query: AgentIcon,
  Action: AgentIcon,
  Flow: AgentIcon,
  Effect: AgentIcon,
  Time: AgentIcon,
  None: AgentIcon,
}
