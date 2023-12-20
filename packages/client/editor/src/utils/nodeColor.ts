import { categoryColorMap, colors } from './colors'

function getCategory(node, specJson) {
  return specJson.find(spec => spec.type === node.type).category
}

export function nodeColor(node, specJson) {
  const nodeCategory = getCategory(node, specJson)
  let colorName = categoryColorMap[nodeCategory]

  if (colorName === undefined) {
    colorName = 'red'
  }
  const [backgroundColor] = colors[colorName]

  const color = getHexColorFromTailwindClass(backgroundColor)

  return color
}

function getHexColorFromTailwindClass(className) {
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
  if (!rgbMatch) return null

  const hex = `#${rgbMatch
    .map(x => {
      const hex = parseInt(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')}`

  return hex
}
