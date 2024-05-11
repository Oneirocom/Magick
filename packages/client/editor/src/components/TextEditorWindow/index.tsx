// import { debounce } from 'lodash'
import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useDispatch, useSelector } from 'react-redux'
import { Window } from 'client/core'
import {
  selectActiveInput,
  setActiveInput,
} from 'client/state'
import { MagickNodeType, useChangeNodeData } from '@magickml/flow-core'
import WindowMessage from '../WindowMessage/WindowMessage'
import { InputSocketSpecJSON } from '@magickml/behave-graph'
import { useOnSelectionChange } from '@xyflow/react'

const TextEditor = () => {
  const dispatch = useDispatch()
  const [code, setCode] = useState<string | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<MagickNodeType | null>(null)

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 1) {
        setSelectedNode(null)
        return
      }
      setSelectedNode(nodes[0])
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
  const activeInput = useSelector(selectActiveInput)

  const handleEditorWillMount = monaco => {
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

      if (configuration.socketInputs.find(input => input.name === socketName))
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
    if (code === undefined || !selectedNode || !activeInput) return

    const formattedCode = code.replace('\r\n', '\n')
    if (formattedCode === activeInput.value) return

    if (activeInput) {
      dispatch(setActiveInput({ ...activeInput, value: formattedCode }))
    }
  }, [debouncedCode, selectedNode, activeInput])

  // Handles loading the code from selected node if a text editor data node
  useEffect(() => {
    if (!selectedNode || !selectedNode?.data?.configuration) return

    const { configuration } = selectedNode.data
    const { textEditorData } = configuration
    if (textEditorData === undefined) return
    if (textEditorData === code) return
    setCode(textEditorData)
  }, [selectedNode?.id])

  // Handles setting the code from the active input
  useEffect(() => {
    if (activeInput?.value === code) return
    if (activeInput?.inputType !== 'string') return
    setCode(activeInput.value)
  }, [activeInput])

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
