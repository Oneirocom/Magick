import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

type ContextType = {
  openProjectWindow: boolean
  openDrawer: boolean
  setOpenDrawer: Dispatch<SetStateAction<boolean>>
  setOpenProjectWindow: Dispatch<SetStateAction<boolean>>
}

const ProjectWindowContext = createContext<ContextType>({
  openProjectWindow: false,
  openDrawer: false,
  setOpenDrawer: () => { },
  setOpenProjectWindow: () => { },
})

export const useProjectWindow = () => useContext(ProjectWindowContext)

type Props = {
  children: React.ReactNode
}

export const ProjectWindowProvider = ({ children }: Props): React.JSX.Element => {
  const [openProjectWindow, setOpenProjectWindow] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(true)

  return (
    <ProjectWindowContext.Provider
      value={{
        openProjectWindow,
        openDrawer,
        setOpenDrawer,
        setOpenProjectWindow,
      }}
    >
      {children}
    </ProjectWindowContext.Provider>
  )
}
