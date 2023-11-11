import React, { createContext, useContext, useState, useEffect } from 'react'
import { NodeModel } from '@minoru/react-dnd-treeview'
import { useSnackbar } from 'notistack'
import { API_ROOT_URL } from 'shared/config'
import { useSelector } from 'react-redux'
import SampleData from './data/sampleData.json'
import { useConfig } from './ConfigProvider'
import { useFeathers } from './FeathersProvider'
import { useGetDocumentsQuery, useGetSpellsQuery } from 'client/state'

export interface TreeNode extends NodeModel {
  fileType: string
}

interface TreeDataContextType {
  treeData: TreeNode[]
  setTreeData: React.Dispatch<React.SetStateAction<TreeNode[]>>
  toDelete: null
  setToDelete: React.Dispatch<React.SetStateAction<null>>
  openDoc: string | number
  setOpenDoc: React.Dispatch<React.SetStateAction<string | number>>
  agentUpdate: boolean
  setAgentUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
interface Document {
  id: string
  content: string
}

interface Spell {
  id: string
  name: string
  type?: string
}

const TreeDataContext = createContext<TreeDataContextType>({
  treeData: [],
  setTreeData: () => { },
  toDelete: null,
  setToDelete: () => { },
  openDoc: '',
  setOpenDoc: () => { },
  agentUpdate: false,
  setAgentUpdate: () => { },
})

export const useTreeData = () => useContext(TreeDataContext)

type Props = {
  children: React.ReactNode
}

export const TreeDataProvider = ({ children }: Props): JSX.Element => {
  const { data: fetchedSpells } = useGetSpellsQuery({})
  const { data: fetchedDocuments } = useGetDocumentsQuery({})

  const [treeData, setTreeData] = useState<TreeNode[]>(SampleData)
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [spells, setSpells] = useState<Spell[] | null>(null)

  const [addedItemIds, setAddedItemIds] = useState<string[]>([])
  const [toDelete, setToDelete] = useState(null)
  const [openDoc, setOpenDoc] = useState<string | number>('')
  const [agentUpdate, setAgentUpdate] = useState(false)

  // function truncateDocs(str, n) {
  //   if (str.length > n) {
  //     return str.substring(0, n) + '...'
  //   }
  //   return str
  // }

  function addNewItem(id, parent, text, fileType) {
    const newItem = {
      id: id,
      parent: parent,
      droppable: false,
      text: text,
      fileType: fileType,
    }

    setTreeData(prevData => {
      const updatedData = prevData.slice() // Create a copy of the existing data array

      const parentIndex = updatedData.findIndex(item => item.id === parent)

      if (parentIndex !== -1) {
        updatedData.splice(parentIndex + 1, 0, newItem) // Insert new item after parent
      }

      return updatedData // Return the updated data
    })
  }

  function deleteItem(id) {
    setTreeData(prevData => {
      const updatedData = prevData.slice() // Create a copy of the existing data array

      const index = updatedData.findIndex(item => item.id === id)

      if (index !== -1) {
        updatedData.splice(index, 1) // Delete item
      }

      return updatedData // Return the updated data
    })
  }

  useEffect(() => {
    console.log('FETCHING SPELLS', fetchedSpells)
    if (!fetchedSpells) return
    if (!fetchedSpells.data.length) return

    setSpells(fetchedSpells.data)

  }, [fetchedSpells])

  useEffect(() => {
    if (!fetchedDocuments) return
    if (!fetchedDocuments.data.length) return

    setDocuments(fetchedDocuments.data)

  }, [fetchedDocuments])

  useEffect(() => {
    if (!documents || !spells) {
      return // Exit early if documents or spells are not available
    }

    // Function to add new item to the tree data while avoiding duplication
    const addNewItemWithoutDuplication = (id, parent, text, fileType) => {
      if (!addedItemIds.includes(id)) {
        addNewItem(id, parent, text, fileType) // Add the new item
        setAddedItemIds(prevIds => [...prevIds, id]) // Update addedItemIds
      }
    }

    // Adding documents
    documents.forEach((doc, index) => {
      addNewItemWithoutDuplication(
        doc?.id,
        3,
        '',
        'txt'
      )
    })

    // find spells which are not in the tree data and delete them
    const spellIds = spells.map(spell => spell.id)
    console.log('TREE DATA', treeData)
    const treeDataIds = treeData.filter(item => item.fileType === 'spell').map(item => item.id)
    const toDelete = treeDataIds.filter(id => !spellIds.includes(id as string))

    console.log('TO DELETE', toDelete)

    toDelete.forEach(id => deleteItem(id))

    // Adding spells without duplicates
    spells.forEach((spell, index) => {
      const type = spell?.type || 'spell'
      addNewItemWithoutDuplication(spell.id, 6, spell.name, 'spell')
    })
  }, [documents, spells, addedItemIds])

  return (
    <TreeDataContext.Provider
      value={{
        treeData,
        setTreeData,
        toDelete,
        setToDelete,
        openDoc,
        setOpenDoc,
        agentUpdate,
        setAgentUpdate,
      }}
    >
      {children}
    </TreeDataContext.Provider>
  )
}
