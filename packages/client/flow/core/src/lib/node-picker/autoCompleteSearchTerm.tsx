"use client"

export const autoCompleteSearchTerm = ({
  filteredNodes,
  search,
  setSearch,
}) => {
  if (!filteredNodes || search.length === 0 || filteredNodes?.length === 0)
    return

  const relevantItems = filteredNodes.filter(node =>
    node.type.toLowerCase().includes(search.toLowerCase())
  )

  if (relevantItems.length === 0) return

  // Function to find the most common prefix among an array of strings
  const findMostCommonPrefix = arr => {
    if (arr.length === 0) return ''

    let prefix = ''
    let maxCount = 0

    for (let i = 0; i < arr[0].length; i++) {
      const currentPrefix = arr[0].slice(0, i + 1)
      let count = 0

      for (let j = 1; j < arr.length; j++) {
        if (arr[j].startsWith(currentPrefix)) {
          count++
        }
      }

      if (count > maxCount) {
        prefix = currentPrefix
        maxCount = count
      }
    }
    return prefix
  }

  // Find the most common prefix that extends the current search term
  const mostCommonPrefix = findMostCommonPrefix(
    relevantItems.map(item => item.type)
  )

  if (relevantItems.length === 1) {
    setSearch(relevantItems[0].type)
  } else if (mostCommonPrefix.length > search.length) {
    setSearch(mostCommonPrefix)
  }
}
