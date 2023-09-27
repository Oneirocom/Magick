// DOCUMENTED
import { usePubSub } from 'client/core'
import { InspectorData, SupportedLanguages } from 'shared/core'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * TextEditorData represents the state and options for the text editor.
 */
export type TextEditorData = {
  options?:
    | Record<string, any>
    | (undefined & {
        language?: SupportedLanguages
      })
  data?: string
  control?: Record<string, any> | undefined
  name?: string
}

/**
 * InspectorContext represents the state/actions for the Inspector.
 */
type InspectorContext = {
  inspectorData: InspectorData | null
  textEditorData: TextEditorData | null
  saveTextEditor: Function
  saveInspector: Function
}

// Create a context for Inspector state
const Context = createContext<InspectorContext>(undefined!)

// Expose the Context through the useInspector hook
export const useInspector = () => useContext(Context)

/**
 * InspectorProvider is a context provider for inspector state and actions.
 */
const InspectorProvider = ({ children, tab }) => {
  const { subscribe, publish, events } = usePubSub()

  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null)
  const [textEditorData, setTextEditorData] = useState({})

  const SET_INSPECTOR = events.$INSPECTOR_SET(tab.id)

  // Subscribe to inspector changes
  useEffect(() => {
    const unsubscribe = subscribe(SET_INSPECTOR, (_, data: InspectorData) => {
      // Clear inspector data if conflicting
      if (data?.nodeId !== inspectorData?.nodeId) setInspectorData(null)

      // Update the inspector data
      setInspectorData(data)

      if (!data.dataControls) return

      // Handle components
      Object.entries(data.dataControls).forEach(([, control]) => {
        if (control?.options?.editor) {
          // Relay data to the text editor
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
    })

    return unsubscribe as () => void
  }, [events, subscribe, publish])

  // Subscribe to text editor changes
  useEffect(() => {
    const unsubscribe = subscribe(
      events.$TEXT_EDITOR_SET(tab.id),
      (event, data) => {
        setTextEditorData(data)
      }
    )

    return unsubscribe as () => void
  }, [events, subscribe, publish])

  // Subscribe to text editor clearing
  useEffect(() => {
    const unsubscribe = subscribe(events.$TEXT_EDITOR_CLEAR(tab.id), () => {
      setTextEditorData({})
    })

    return unsubscribe as () => void
  }, [events, subscribe, publish])

  // Save text editor changes
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

  // Save inspector changes
  const saveInspector = inspectorData => {
    setInspectorData(inspectorData)
    publish(events.$NODE_SET(tab.id, inspectorData.nodeId), inspectorData)
  }

  const publicInterface: InspectorContext = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    saveInspector,
  }

  // Provide the public interface to the Context
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default InspectorProvider
