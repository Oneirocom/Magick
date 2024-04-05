import type { Node } from 'reactflow'
import type { NodeSpecJSON } from '@magickml/behave-graph'
import { categoryColorMap, colors, valueTypeColorMap } from './colors'
import { SpellInterfaceWithGraph } from 'server/schemas'

function getCategory(node: Node, specJson: NodeSpecJSON[]) {
  return (
    (specJson.find(spec => spec.type === node.type)
      ?.category as NodeSpecJSON['category']) ||
    ('None' as NodeSpecJSON['category'])
  )
}

export function nodeColor(
  node: Node,
  specJson: NodeSpecJSON[],
  spell: SpellInterfaceWithGraph
) {
  const nodeCategory = getCategory(node, specJson)
  let colorName = categoryColorMap[nodeCategory]

  const { configuration } = node.data

  if (colorName === undefined) {
    colorName = 'red'
  }
  let [backgroundColor] = colors[colorName]

  if (configuration?.variableId) {
    const variable = spell.graph.variables.find(
      variable => variable.id === configuration.variableId
    )

    if (variable) {
      const colorName = valueTypeColorMap[variable.valueTypeName]
      if (colorName) {
        ;[backgroundColor] = colors[colorName]
      }
    }
  }

  const color = getHexColorFromTailwindClass(backgroundColor)

  return color
}

function getHexColorFromTailwindClass(className: string) {
  // Create a temporary element
  const tempElement = document.createElement('div')
  tempElement.className = className

  // Append it to the body (it won't be visible)
  document.body.appendChild(tempElement)

  // Get the computed style
  const style = window.getComputedStyle(tempElement)
  const rgb = style.backgroundColor

  // Remove the element from the DOM
  document.body.removeChild(tempElement)

  // Convert RGB to Hex
  const rgbMatch = rgb.match(/\d+/g)
  if (!rgbMatch) return '#000000'

  const hex = `#${rgbMatch
    .map(x => {
      const hex = parseInt(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')}`

  return hex
}
