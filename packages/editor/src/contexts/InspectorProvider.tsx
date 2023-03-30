// GENERATED 
/** Typescript imports */
import { InspectorData, SupportedLanguages } from '@magickml/engine'
import { usePubSub } from '../contexts/PubSubProvider'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * TextEditorData type definition.
 */
export type TextEditorData = {
  options?: Record<string, any> | undefined & {
    language?: SupportedLanguages
  }
  data?: string
  control?: Record<string, any> | undefined
  name?: string
}

/**
 * InspectorContext type definition.
 */
type InspectorContext = {
  inspectorData: InspectorData | null
  textEditorData: TextEditorData | null
  saveTextEditor: Function
  saveInspector: Function
}

/** Creating context for Inspector */
const Context = createContext<InspectorContext>(undefined!)

/**
 * A hook to get the Inspector context.
 * @returns {InspectorContext} Inspector context.
 */
export const useInspector = () => useContext(Context)

/**
 * InspectorProvider Component
 * @param {object} props - Props received by the component.
 * @param {ReactNode} props.children - Child components.
 * @param {object} props.tab - Tab object.
 * @returns {JSX.Element} InspectorProvider component.
 */
const InspectorProvider = ({ children, tab }) => {
  const { subscribe, publish, events } = usePubSub()

  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null)
  const [textEditorData, setTextEditorData] = useState({})

  const SET_INSPECTOR = events.$INSPECTOR_SET(tab.id)

  // Handling incoming data and updating the inspector data.
  useEffect(() => {
    return subscribe(SET_INSPECTOR, (_, data: InspectorData) => {
      if (data?.nodeId !== inspectorData?.nodeId) setInspectorData(null)
      setInspectorData(data)
      
      if (!data.dataControls) return

      Object.entries(data.dataControls).forEach(([, control]) => {
        if (control?.options?.editor) {
          const textData = {
            data: data.data[control.dataKey],
            nodeId: data.nodeId,
            name: data.name,
            control: control,
            options: control.options,
          }

          setTextEditorData(textData)
        }
      })
    }) as () => void
  }, [events, subscribe, publish])

  // Handling text editor subscription.
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_SET(tab.id), (event, data) => {
      setTextEditorData(data)
    }) as () => void
  }, [events, subscribe, publish])

  // Clearing text editor subscription.
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_CLEAR(tab.id), () => {
      setTextEditorData({})
    }) as () => void
  }, [events, subscribe, publish])

  /**
   * saveTextEditor function
   * @param {object} textData - Text data object
   */
  const saveTextEditor = textData => {
    const textUpdate = {
      [textData.control.dataKey]: textData.data,
    }

    if (!inspectorData) return

    const update = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...textUpdate,
      },
    }

    publish(events.$NODE_SET(tab.id, textData.nodeId), update)
    if (inspectorData) {
      setInspectorData(update)
    }
  }

  /**
   * saveInspector function
   * @param {InspectorData} inspectorData - Inspector data
   */
  const saveInspector = inspectorData => {
    setInspectorData(inspectorData)
    publish(events.$NODE_SET(tab.id, inspectorData.nodeId), inspectorData)
  }

  // Public interface for Inspector context.
  const publicInterface: InspectorContext = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    saveInspector,
  }

  // Providing context to child components.
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

// Exporting the default InspectorProvider component.
export default InspectorProvider