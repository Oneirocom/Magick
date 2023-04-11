// DOCUMENTED
/* eslint-disable @-eslint/ban-types */
import { LoadingScreen } from '@magickml/client-core'
import {
  Actions,
  DockLocation,
  Layout as LayoutComponent,
  Model,
  TabNode,
  TabSetNode,
} from 'flexlayout-react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { saveTabLayout } from '../state/tabs'

// List of window types used to load components from data sent by rete
const windowTypes: WindowTypes = {
  TEXT_EDITOR: 'textEditor',
  INSPECTOR: 'inspector',
  EDITOR: 'editor',
  PLAYTEST: 'playtest',
  CONSOLE: 'debugConsole',
  PROJECT: 'project',
}

type WindowType =
  | 'textEditor'
  | 'inspector'
  | 'editor'
  | 'playtest'
  | 'debugConsole'
  | 'settings'
  | 'project'

type WindowTypes = Record<string, WindowType>

declare global {
  interface Window {
    getLayout: any
  }
}

// LayoutContext type
type LayoutContext = {
  currentModel: Model | null
  createModel: Function
  createOrFocus: Function
  windowTypes: WindowTypes
  currentRef: any
  setCurrentRef: any
}

// Creating the context
const Context = createContext<LayoutContext>(undefined!)

// Helper hook to use Layout context
export const useLayout = () => useContext(Context)

// LayoutProvider component
const LayoutProvider = ({ children, tab }) => {
  // State and ref for current model
  const currentModelRef = useRef<Model | null>(null)
  const [currentModel, setCurrentModel] = useState<Model | null>(null)

  // State for current reference
  const [currentRef, setCurrentRef] = useState(null)

  // Update current model
  const updateCurrentModel = (model: Model) => {
    currentModelRef.current = model
    setCurrentModel(model)
  }

  // Side effect for layout getter
  useEffect(() => {
    window.getLayout = () =>
      currentModelRef?.current && currentModelRef?.current?.toJson()
  }, [currentModel])

  // Create model from JSON
  const createModel = json => {
    const model = Model.fromJson(json)
    updateCurrentModel(model)
    return model
  }

  // Add window function
  const addWindow = (componentType, title) => {
    const tabJson = {
      type: 'tab',
      component: componentType,
      weight: 12,
      name: title,
    }
    const currentModel = currentModelRef.current

    if (!currentModel) return

    const rootNode = currentModel.getRoot()
    const tabNode = new TabNode(currentModel, tabJson)
    const tabSetNode = new TabSetNode(currentModel, {
      type: 'tabset',
      weight: 12,
    })

    rootNode._addChild(tabSetNode)

    currentModel.doAction(
      Actions.moveNode(
        tabNode.getId(),
        tabSetNode.getId(),
        DockLocation.RIGHT,
        0
      )
    )
  }

  // Create or focus existing window
  const createOrFocus = (componentName, title) => {
    if (!currentModelRef.current) return

    const component = Object.entries(currentModelRef.current._idMap).find(
      ([, value]) => {
        return value._attributes?.component === componentName
      }
    )

    if (component) currentModel?.doAction(Actions.selectTab(component[0]))
    if (!component) addWindow(componentName, title)
  }

  // Public interface for provider
  const publicInterface = {
    currentModel,
    createModel,
    createOrFocus,
    windowTypes,
    currentRef,
    setCurrentRef,
  }

  // Rendering Context Provider
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

// Layout component
export const Layout = ({ json, factory, tab }) => {
  const dispatch = useDispatch()
  const { currentModel, createModel, setCurrentRef } = useLayout()
  const layoutRef = useRef(null)

  // Side effect for creating model if there is JSON data
  useEffect(() => {
    if (!json || currentModel) return
    createModel(json)
  }, [json, createModel, currentModel])

  useEffect(() => {
    if (!json) return
    createModel(json)
  }, [json])

  // Side effect for updating current reference
  useEffect(() => {
    setCurrentRef(layoutRef)
  }, [layoutRef, setCurrentRef])

  // Handle model change
  const onModelChange = () => {
    if (!currentModel) return
    dispatch(
      saveTabLayout({ tabId: tab.id, layoutJson: currentModel.toJson() })
    )
  }

  if (!currentModel) return <LoadingScreen />

  // Rendering LayoutComponent
  return (
    <LayoutComponent
      onModelChange={onModelChange}
      ref={layoutRef}
      model={currentModel}
      factory={factory}
      font={{ size: '12px' }}
    />
  )
}

// Exporting LayoutProvider as default
export default LayoutProvider
