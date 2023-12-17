import { debounce } from 'lodash'
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Window } from 'client/core'
import { selectActiveNode } from 'client/state'
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData'
import WindowMessage from '../WindowMessage/WindowMessage'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)

  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
  })

  const selectedNode = useSelector(selectActiveNode(props.tab.id))
  const handleChange = useChangeNodeData(selectedNode?.id);

  useEffect(() => {
    if (!selectedNode) return
    const { configuration } = selectedNode.data
    const { textEditorData } = configuration
    if (textEditorData === undefined) return
    setCode(textEditorData)
  }, [selectedNode])

  // listen for changes to the code and check if selected node is text template
  // then we want to parse the template for sockets and add them to the node
  useEffect(() => {
    if (!code) return
    if (!selectedNode) return
    if (!selectedNode.data?.configuration?.textEditorOptions?.options?.language) return
    const { configuration } = selectedNode.data
    const { textEditorOptions } = configuration
    const { options } = textEditorOptions
    const { language } = options
    if (language !== 'handlebars') return
    // socket regex looks for handlebars style {{socketName}}
    const socketRegex = /{{(.+?)}}/g
    const socketMatches = code.matchAll(socketRegex)
    const sockets = []
    for (const match of socketMatches) {
      const socketName = match[1]
      const socket = {
        name: socketName,
        valueType: 'string',
      }
      sockets.push(socket)
    }
    handleChange('configuration', {
      ...configuration,
      socketInputs: sockets,
    })
    // handleChange('sockets', sockets)
  }, [code])

  if (!selectedNode) return null

  const { configuration } = selectedNode.data
  const { textEditorOptions, textEditorData } = configuration

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      wordWrap: true,
      colors: {
        'editor.background': "#171b1c",
      },
    })
  }

  const debounceSave = debounce((code) => {
    handleChange('configuration', {
      ...configuration,
      textEditorData: code,
    })
  }, 1000)

  const updateCode = rawCode => {
    const code = rawCode.replace('\r\n', '\n')
    debounceSave(code)
  }

  const setCode = update => {
    setCodeState(update)
  }

  if (textEditorData === undefined)
    return <WindowMessage content="Select a node with a text field" />

  return (
    <Window>
      <Editor
        theme="sds-dark"
        // height={height} // This seemed to have been causing issues.
        language={textEditorOptions?.options?.language}
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={updateCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  )
}

export default TextEditor
