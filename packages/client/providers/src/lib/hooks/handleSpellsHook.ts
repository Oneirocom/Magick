import { useGetSpellsQuery } from 'client/state'
import { useEffect, useState } from 'react'

interface Spell {
  id: string
  name: string
  type?: string
}

type Props = {
  treeData: any
  deleteItem: (id: string) => void
  addNewItemWithoutDuplication: (
    id: string,
    index: number,
    content: string,
    type: string
  ) => void
  addedItemIds: string[]
}

export const handleSpellsHook = ({
  treeData,
  deleteItem,
  addNewItemWithoutDuplication,
  addedItemIds,
}: Props) => {
  const { data: fetchedSpells } = useGetSpellsQuery({})
  const [spells, setSpells] = useState<Spell[] | null>(null)

  useEffect(() => {
    if (!fetchedSpells) return
    if (!fetchedSpells.data.length) return

    setSpells(fetchedSpells.data)
  }, [fetchedSpells])

  // handle spells
  useEffect(() => {
    if (!spells) return // Exit early if documents or spells are not available

    // find spells which are not in the tree data and delete them
    const spellIds = spells.map(spell => spell.id)
    const treeDataIds = treeData
      .filter(item => item.fileType === 'spell')
      .map(item => item.id)
    const toDelete = treeDataIds.filter(id => !spellIds.includes(id as string))

    toDelete.forEach(id => deleteItem(id))

    // Adding spells without duplicates
    spells.forEach(spell => {
      const type = spell?.type || 'spell'
      addNewItemWithoutDuplication(spell.id, 6, spell.name, type)
    })
  }, [spells, addedItemIds])

  return {
    spells,
  }
}
