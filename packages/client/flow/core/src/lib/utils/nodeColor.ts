"use client";
import type { NodeSpecJSON } from '@magickml/behave-graph'
import { categoryColorMap, colorHexMap, valueTypeColorMap } from './colors'
import { MagickNodeType } from '@magickml/client-types'

function getCategory(node: MagickNodeType, specJson: NodeSpecJSON[]) {
  return (
    (specJson.find(spec => spec.type === node.type)
      ?.category as NodeSpecJSON['category']) ||
    ('None' as NodeSpecJSON['category'])
  )
}

export function nodeColor(node: MagickNodeType, specJson: NodeSpecJSON[]) {
  const nodeCategory = getCategory(node, specJson)
  let colorName = categoryColorMap[nodeCategory]

  const { configuration } = node.data

  if (colorName === undefined) {
    colorName = 'red'
  }

  if (configuration?.valueTypeName) {
    const colorName = valueTypeColorMap[configuration.valueTypeName]
    if (colorName) {
      return colorHexMap[colorName]
    }
  }

  return colorHexMap[colorName]
}
