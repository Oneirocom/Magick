import {
  Layout as LayoutComponent,
  Model,
  Actions,
  DockLocation,
  TabNode,
  TabSetNode,
} from 'flexlayout-react'
import { useContext, createContext, useEffect, useState, useRef } from 'react'

import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import { saveTabLayout } from '@/state/tabs'
import { useDispatch } from 'react-redux'
// Component types are listed here which are used to load components from the data sent by rete
const windowTypes: WindowTypes = {
  TEXT_EDITOR: 'textEditor',
  INSPECTOR: 'inspector',
  STATE_MANAGER: 'stateManager',
  EDITOR: 'editor',
  PLAYTEST: 'playtest',
  WYSIWYG_EDITOR: 'wysiwygEditor',
  CONSOLE: 'debugConsole',
  SETTINGS: 'settings',
  SEARCH_CORPUS: 'searchCorpus',
  ENT_MANAGER: 'entityManager',
  GREETINGS_MANAGER: 'greetingsManager',
  EVENT_MANAGER: 'eventManager',
  VIDEO_TRANSCRIPTION: 'videoTranscription',
  CALENDAR_TAB: 'calendarTab',
  MESSAGE_REACTION_EDITOR: 'messageReactionEditor',
}

type WindowType =
  | 'textEditor'
  | 'inspector'
  | 'stateManager'
  | 'editor'
  | 'playtest'
  | 'debugConsole'
  | 'settings'
  | 'searchCorpus'
  | 'entityManager'
  | 'greetingsManager'
  | 'wysiwygEditor'
  | 'messageReactionEditor'
  | 'eventManager'
  | 'videoTranscription'
  | 'calendarTab'
type WindowTypes = Record<string, WindowType>

// helpful resources
// https://github.com/edemaine/comingle/blob/726d42e975307beb5281fddbf576591c36c1022d/client/Room.coffee#L365-L384
// https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx

declare global {
  interface Window {
    getLayout: any
  }
}

type LayoutContext = {
  currentModel: Model | null
  createModel: Function
  createOrFocus: Function
  windowTypes: WindowTypes
  currentRef
  setCurrentRef
}

const Context = createContext<LayoutContext>(undefined!)

export const useLayout = () => useContext(Context)

const LayoutProvider = ({ children, tab }) => {
  const currentModelRef = useRef<Model | null>(null)

  const [currentModel, setCurrentModel] = useState<Model | null>(null)
  const [currentRef, setCurrentRef] = useState(null)

  const updateCurrentModel = (model: Model) => {
    currentModelRef.current = model
    setCurrentModel(model)
  }

  useEffect(() => {
    window.getLayout = () =>
      currentModelRef?.current && currentModelRef?.current?.toJson()
  }, [currentModel])

  const createModel = json => {
    const model = Model.fromJson(json)
    updateCurrentModel(model)

    return model
  }

  const addWindow = (componentType, title) => {
    // Solution partly taken from here.
    // Programatic creation of a tabSet and a tab added to it.
    // https://github.com/caplin/FlexLayout/issues/54
    const tabJson = {
      type: 'tab',
      component: componentType,
      weight: 12,
      name: title,
    }
    const currentModel = currentModelRef.current

    if (!currentModel) return

    // TODO the types provided by react flex layout are wrong for these constructors. Fix with a PR or a fork of the library?
    const rootNode = currentModel.getRoot()
    // @ts-expect-error
    const tabNode = new TabNode(currentModel, tabJson)
    // @ts-expect-error
    const tabSetNode = new TabSetNode(currentModel, {
      type: 'tabset',
      weight: 12,
    })

    // We are here using a provate variable, so TS isnt picking it up
    // @ts-expect-error
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

  const createOrFocus = (componentName, title) => {
    if (!currentModelRef.current) return
    // We are here using a provate variable, so TS isnt picking it up
    // @ts-expect-error
    const component = Object.entries(currentModelRef.current._idMap).find(
      ([, value]) => {
        // Since there is not type for _idMap, we don't know the type value is.
        // @ts-expect-error
        return value._attributes?.component === componentName
      }
    )

    // the nodeId is stored in the zeroth index of the find
    if (component) currentModel?.doAction(Actions.selectTab(component[0]))
    if (!component) addWindow(componentName, title)
  }

  const publicInterface = {
    currentModel,
    createModel,
    createOrFocus,
    windowTypes,
    currentRef,
    setCurrentRef,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export const Layout = ({ json, factory, tab }) => {
  const dispatch = useDispatch()
  const { currentModel, createModel, setCurrentRef } = useLayout()
  const layoutRef = useRef(null)

  useEffect(() => {
    if (!json || currentModel) return
    createModel(json)
  }, [json, createModel, currentModel])

  useEffect(() => {
    setCurrentRef(layoutRef)
  }, [layoutRef, setCurrentRef])

  const onModelChange = () => {
    if (!currentModel) return
    dispatch(
      saveTabLayout({ tabId: tab.id, layoutJson: currentModel.toJson() })
    )
  }

  if (!currentModel) return <LoadingScreen />

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

export default LayoutProvider
