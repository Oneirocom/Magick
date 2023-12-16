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
  const codeRef = useRef<string>()

  const selectedNode = useSelector(selectActiveNode(props.tab.id))
  const handleChange = useChangeNodeData(selectedNode?.id);

  useEffect(() => {
    if (!selectedNode) return
    const { configuration } = selectedNode.data
    const { textEditorData } = configuration
    if (textEditorData === undefined) return
    setCode(textEditorData)
  }, [selectedNode])

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
    codeRef.current = update
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
