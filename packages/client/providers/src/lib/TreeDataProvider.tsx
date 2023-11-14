import React, { createContext, useContext, useState, useEffect } from 'react'
import { NodeModel } from '@minoru/react-dnd-treeview'
import { useSnackbar } from 'notistack'
import { API_ROOT_URL } from 'shared/config'
import { useSelector } from 'react-redux'
import SampleData from './data/sampleData.json'
import { useConfig } from './ConfigProvider'
import { useFeathers } from './FeathersProvider'
import { useGetDocumentsQuery, useGetSpellsQuery } from 'client/state'
import { handleDocumentsHook } from './hooks/handleDocumentsHook'
import { handleSpellsHook } from './hooks/handleSpellsHook'

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
  const [treeData, setTreeData] = useState<TreeNode[]>(SampleData)
  const [addedItemIds, setAddedItemIds] = useState<string[]>([])
  const [toDelete, setToDelete] = useState(null)
  const [openDoc, setOpenDoc] = useState<string | number>('')
  const [agentUpdate, setAgentUpdate] = useState(false)

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

  // Function to add new item to the tree data while avoiding duplication
  const addNewItemWithoutDuplication = (id, parent, text, fileType) => {
    if (!addedItemIds.includes(id)) {
      addNewItem(id, parent, text, fileType) // Add the new item
      setAddedItemIds(prevIds => [...prevIds, id]) // Update addedItemIds
    }
  }

  handleDocumentsHook({ addNewItemWithoutDuplication })
  handleSpellsHook({ treeData, addNewItemWithoutDuplication, deleteItem, addedItemIds })

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
