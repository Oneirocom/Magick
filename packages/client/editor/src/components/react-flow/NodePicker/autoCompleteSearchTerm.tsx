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

  // Function to find the longest common prefix among an array of strings
  const findLongestCommonPrefix = arr => {
    if (arr.length === 0) return ''

    let prefix = arr[0]
    for (let i = 1; i < arr.length; i++) {
      while (arr[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1)
        if (prefix === '') return ''
      }
    }
    return prefix
  }

  // Find the longest common prefix that extends the current search term
  const longestCommonPrefix = findLongestCommonPrefix(
    relevantItems.map(item => item.type)
  )

  if (longestCommonPrefix.length > search.length) {
    setSearch(longestCommonPrefix)
  }
}
