import React, { createContext, useContext, useState, useEffect } from 'react'
import { NodeModel } from '@minoru/react-dnd-treeview'
import { useSnackbar } from 'notistack'
import { useConfig, useFeathers } from '@magickml/client-core'
import { API_ROOT_URL } from '@magickml/config'
import { useSelector } from 'react-redux'
import SampleData from './data/sampleData.json'

interface TreeDataContextType {
  treeData: NodeModel[]
  setTreeData: React.Dispatch<React.SetStateAction<NodeModel[]>>
}

const TreeDataContext = createContext<TreeDataContextType>({
  treeData: [],
  setTreeData: () => {},
})

export const useTreeData = () => useContext(TreeDataContext)

type Props = {
  children: React.ReactNode
}

export const TreeDataProvider = ({ children }: Props): JSX.Element => {
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData)
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [spells, setSpells] = useState<any>(null)
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  function truncateDocs(str, n) {
    if (str.length > n) {
      return str.substring(0, n) + '...'
    }
    return str
  }

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

  useEffect(() => {
    async function fetchData() {
      try {
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

    fetchData() // Fetch documents from API
  }, [config.projectId, token, client])

  useEffect(() => {
    if (!documents || !spells) {
      return // Exit early if documents or spells are not available
    }

    const addedSpellIds = new Set() // Keep track of added spell IDs

    // Adding documents
    documents.forEach((doc, index) => {
      addNewItem(doc?.id, 3, truncateDocs(doc?.content, 8), 'txt')
    })

    // Adding spells without duplicates
    spells.forEach((spell, index) => {
      if (!addedSpellIds.has(spell.id)) {
        addNewItem(spell.id, 6, spell.name, 'spell')
        addedSpellIds.add(spell.id)
      }
    })
  }, [documents, spells])

  return (
    <TreeDataContext.Provider value={{ treeData, setTreeData }}>
      {children}
    </TreeDataContext.Provider>
  )
}
