import { createContext, useContext, useEffect, useState } from 'react'
import {
  GridviewApi,
  SerializedGridviewComponent,
} from 'dockview'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setDockviewTheme } from 'client/state'
import { useDockviewTheme } from 'client/state'


type Resizing = {
  id: string,
  animationDuration: number,
  size: number
}

type DocviewContext = {
  theme: string
  setTheme: (theme: string) => void
  api: GridviewApi
  setApi: (api: GridviewApi) => void
  getLayout: () => SerializedGridviewComponent | null
  setLayout: (layout: SerializedGridviewComponent) => void
  resizing: Resizing
  setResizing: (resizing: Resizing) => void
}

const LAYOUT_KEY = 'global-layout'

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useGlobalLayout = () => useContext(Context)

export const GlobalLayoutProvider = ({ children }) => {
  const [api, setApi] = useState<GridviewApi>()
  const [resizing, setResizing] = useState<Resizing>()

  const { theme, setTheme } = useDockviewTheme()

  const getLayout = () => {
    const layout = localStorage.getItem(LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(localStorage.getItem(LAYOUT_KEY)) as SerializedGridviewComponent
  }

  const setLayout = (layout: SerializedGridviewComponent) => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
  }

  useEffect(() => {
    if (!api) {
      return
    }

    // set up API event handlers
    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      setLayout(layout)
    })
  }, [api])

  const publicInterface = {
    theme,
    setTheme,
    api,
    setApi,
    getLayout,
    setLayout,
    resizing,
    setResizing,
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}
