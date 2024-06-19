'use client'

import Editor, { Monaco } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Window } from 'client/core'
import { useChangeNodeData } from '@magickml/flow-core'
import WindowMessage from '../WindowMessage/WindowMessage'
import { InputSocketSpecJSON } from '@magickml/behave-graph'
import { useOnSelectionChange } from '@xyflow/react'
import { MagickNodeType } from '@magickml/client-types'
import { usePubSub } from '@magickml/providers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'client/state'

const TextEditor = () => {
  const [code, setCode] = useState<string | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<MagickNodeType | null>(null)
  const { subscribe, publish, events } = usePubSub()
  const dispatch = useDispatch()

  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const activeInput = useSelector(
    (state: RootState) => state.globalConfig.activeInput
  )

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 1 || nodes[0] === undefined) {
        setSelectedNode(null)
        dispatch
        return
      } else {
        setSelectedNode(nodes[0])
      }
    },
  })

  const [debouncedCode] = useDebounce(code, 2000)

  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
    fontSize: 16,
    lineNumbers: false,
  })

  const updateNodeData = useChangeNodeData(selectedNode?.id)

  const handleChange = (key: string, value: any) => {
    if (!selectedNode) return
    updateNodeData(key, value)
  }

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      wordWrap: true,
      colors: {
        'editor.background': '#171b1c',
      },
    })
  }

  useEffect(() => {
    if (code === undefined) return
    if (!selectedNode || !selectedNode?.data?.configuration) return

    const { configuration } = selectedNode.data

    const formattedCode = code.replace('\r\n', '\n')
    if (selectedNode?.data?.configuration?.textEditorData !== undefined) {
      handleChange('configuration', {
        ...configuration,
        textEditorData: formattedCode,
      })
    }

    if (!selectedNode.data?.configuration?.textEditorOptions?.options?.language)
      return
    const { textEditorOptions } = configuration
    const { options } = textEditorOptions
    const { language } = options

    if (language !== 'handlebars') return
    // socket regex looks for handlebars style {{socketName}}
    const socketRegex = /{{(?![/#]|this\b|\.\w+)(\w+)}}/g

    const socketMatches = code.matchAll(socketRegex)
    const sockets: InputSocketSpecJSON[] = []
    for (const match of socketMatches) {
      if (!match[1]) continue
      const socketName = match[1]
        .split(' ')
        .filter(
          name =>
            !name.startsWith('#') &&
            !name.startsWith('/') &&
            !name.startsWith('@') &&
            name !== 'this'
        )
        .join('')
        .trim()

      if (!socketName) continue

      const socket: InputSocketSpecJSON = {
        name: socketName,
        valueType: 'string',
      }

      console.log('socket', socket)

      if (
        configuration.socketInputs.find(
          (input: InputSocketSpecJSON) => input.name === socketName
        )
      )
        continue

      sockets.push(socket)
    }

    handleChange('configuration', {
      ...configuration,
      textEditorData: formattedCode,
      socketInputs: [...configuration.socketInputs, ...sockets.filter(Boolean)],
    })
  }, [debouncedCode])

  // Handle updating the nodes input socket value
  useEffect(() => {
    if (
      code === undefined ||
      !selectedNode ||
      !currentTab ||
      activeInput?.nodeId !== selectedNode?.id
    )
      return

    const formattedCode = code.replace('\r\n', '\n')
    publish(events.$CHAT_TO_INPUT(currentTab.id), {
      value: formattedCode,
      nodeId: selectedNode.id,
      name: activeInput?.name || '',
      inputType: 'string',
    })
  }, [code, selectedNode, currentTab, activeInput])

  // Handles loading the code from selected node if a text editor data node
  useEffect(() => {
    if (!selectedNode || !selectedNode?.data?.configuration) return

    const { configuration } = selectedNode.data
    const { textEditorData } = configuration
    if (textEditorData === undefined) return
    if (textEditorData === code) return
    setCode(textEditorData)
  }, [selectedNode?.id])

  useEffect(() => {
    if (activeInput?.value === code) return
    if (activeInput?.inputType !== 'string') return
    setCode(activeInput.value)
  }, [activeInput])

  useEffect(() => {
    if (!currentTab || !activeInput) return
    const unsubscribe = subscribe(
      events.$INPUT_TO_CHAT(currentTab.id),
      (eventName, { value, nodeId: incomingNodeId, name, inputType }) => {
        setCode(value)
      }
    )
    return () => {
      unsubscribe()
    }
  }, [currentTab, activeInput])

  if (!selectedNode || !selectedNode?.data?.configuration) return null

  const { configuration } = selectedNode.data
  const { textEditorOptions, textEditorData } = configuration

  if (
    textEditorData === undefined &&
    (!activeInput || activeInput?.inputType !== 'string')
  )
    return <WindowMessage content="Select a node with a text field" />

  return (
    <Window>
      <div className="flex h-full bg-[var(--background-color-dark)] w-[96%] m-auto pt-2 pb-2">
        <Editor
          theme="sds-dark"
          // height={height} // This seemed to have been causing issues.
          language={textEditorOptions?.options?.language}
          value={code}
          options={editorOptions}
          defaultValue={code}
          onChange={setCode}
          beforeMount={handleEditorWillMount}
        />
      </div>
    </Window>
  )
}

export default TextEditor
