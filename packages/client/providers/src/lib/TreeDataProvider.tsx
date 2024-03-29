import React, { createContext, useContext, useState, useEffect } from 'react'
import { NodeModel } from '@minoru/react-dnd-treeview'
import { useGetSpellsQuery } from 'client/state'

export interface TreeNode extends NodeModel {
  fileType: string
  spellReleaseId?: string | null;
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

interface Spell {
  id: string
  name: string
  type?: string
  spellReleaseId?: string | null;
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

export const TreeDataProvider = ({ children }: Props): React.JSX.Element => {
  const { data: fetchedSpells } = useGetSpellsQuery({}, {
    refetchOnMountOrArgChange: true,
  })

  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [toDelete, setToDelete] = useState(null)
  const [openDoc, setOpenDoc] = useState<string | number>('')
  const [agentUpdate, setAgentUpdate] = useState(false)

  const updateTreeData = (spells: Spell[]) => {
    if (!fetchedSpells) return
    const newTreeData = spells.map(spell => ({
      id: spell.id,
      parent: 0,
      droppable: false,
      text: spell.name,
      fileType: spell.type || 'spell',
      spellReleaseId: spell.spellReleaseId
    }));

    setTreeData(newTreeData);
  };

  useEffect(() => {
    if (!fetchedSpells) return;

    updateTreeData(fetchedSpells.data);
  }, [fetchedSpells]);

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
