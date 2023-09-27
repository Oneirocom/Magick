import React, { createContext, useContext, useState, useEffect } from 'react'
import { NodeModel } from '@minoru/react-dnd-treeview'
import { useSnackbar } from 'notistack'
import { useConfig, useFeathers } from 'client/core'
import { API_ROOT_URL } from 'shared/config'
import { useSelector } from 'react-redux'
import SampleData from './data/sampleData.json'

interface TreeDataContextType {
  treeData: NodeModel[]
  setTreeData: React.Dispatch<React.SetStateAction<NodeModel[]>>
  isAdded: boolean
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>
  docState: boolean
  setDocState: React.Dispatch<React.SetStateAction<boolean>>
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
}

const TreeDataContext = createContext<TreeDataContextType>({
  treeData: [],
  setTreeData: () => {},
  isAdded: false,
  setIsAdded: () => {},
  docState: false,
  setDocState: () => {},
  toDelete: null,
  setToDelete: () => {},
  openDoc: '',
  setOpenDoc: () => {},
  agentUpdate: false,
  setAgentUpdate: () => { },
})

export const useTreeData = () => useContext(TreeDataContext)

type Props = {
  children: React.ReactNode
}

export const TreeDataProvider = ({ children }: Props): JSX.Element => {
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData)
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [spells, setSpells] = useState<Spell[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const FeathersContext = useFeathers()
  const client = FeathersContext.client
  const [isAdded, setIsAdded] = useState(false)
  const [addedItemIds, setAddedItemIds] = useState<string[]>([])
  const [docState, setDocState] = useState(false)
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

  const fetchData = async () => {
    //first initialize states to null
    setDocuments(null)
    setSpells(null)
    try {
      // Fetch your data here...
      const response = await fetch(
        `${API_ROOT_URL}/documents?projectId=${config.projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const spellsResponse = await client.service('spells').find({
        query: {
          projectId: config.projectId,
        },
      })

      if ('error' in spellsResponse) {
        enqueueSnackbar('Error fetching spells', {
          variant: 'error',
        })
      } else {
        const fetchedSpells = spellsResponse.data
        setSpells(fetchedSpells)
      }

      const data = await response.json()

      setDocuments(data.data)
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  useEffect(() => {
    fetchData() // Fetch data initially
  }, [config.projectId, token, client])

  useEffect(() => {
    if (isAdded || docState) {
      if (toDelete !== null) {
        // Remove deleted ID from addedItemIds
        setAddedItemIds(prevIds => prevIds.filter(item => item !== toDelete))
        // Find and remove the item with the matching ID from treeData
        setTreeData(prevData => prevData.filter(item => item.id !== toDelete))
        setToDelete(null) // Reset toDelete after removing ID
      }

      fetchData() // Fetch data again when isAdded or docState is true
      setIsAdded(false) // Reset isAdded after fetching
      setDocState(false)
    }
  }, [isAdded, docState, toDelete])

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
    // Adding spells without duplicates
    spells.forEach((spell, index) => {
      addNewItemWithoutDuplication(spell.id, 6, spell.name, 'spell')
    })
  }, [documents, spells, addedItemIds])

  return (
    <TreeDataContext.Provider
      value={{
        treeData,
        setTreeData,
        isAdded,
        setIsAdded,
        docState,
        setDocState,
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
