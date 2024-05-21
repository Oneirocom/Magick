'use client'

export const SearchResults = ({
  filteredNodes,
  focusedIndex,
  setFocusedIndex,
  pickedNodePosition,
  onPickNode,
  instance,
}) => {
  return (
    <>
      <div className="p-2 text-xs text-gray-400">
        Press <span className="font-bold">Tab</span> to autocomplete
      </div>
      <div className="overflow-y-scroll max-h-[320px] w-full">
        {filteredNodes.map(({ type }, index) => (
          <div
            key={type}
            className={`p-2 cursor-pointer border-b border-[var(--secondary-3)] ${
              index === focusedIndex ? 'bg-[#282d33]' : 'hover:bg-[#282d33]'
            }`}
            onMouseEnter={() => setFocusedIndex(index)}
            onClick={e => {
              e.stopPropagation()
              if (!pickedNodePosition) return
              onPickNode(type, pickedNodePosition)
            }}
          >
            <div className="">{type}</div>
          </div>
        ))}
      </div>
    </>
  )
}
