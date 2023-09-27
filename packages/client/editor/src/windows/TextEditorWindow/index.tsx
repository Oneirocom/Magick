import { Button, Window } from 'client/core'
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import '../../screens/Magick/magick.module.css'
import WindowMessage from '../../components/WindowMessage'
import { TextEditorData, useInspector } from '../../contexts/InspectorProvider'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)
  const [data, setData] = useState<TextEditorData | null>(null)
  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
  })
  const [unSavedChanges, setUnSavedChanged] = useState<boolean>(false)
  const codeRef = useRef<string>()

  const { textEditorData, saveTextEditor, inspectorData } = useInspector()

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      wordWrap: true,
      colors: {
        'editor.background': '#272727',
      },
    })
  }

  useEffect(() => {
    setData(textEditorData)
    setCode(textEditorData.data)
  }, [textEditorData])

  const save = code => {
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    saveTextEditor(update)
  }

  const onSave = () => {
    setUnSavedChanged(false)
    save(codeRef.current)
  }

  const updateCode = rawCode => {
    if (!unSavedChanges) setUnSavedChanged(true)
    const code = rawCode.replace('\r\n', '\n')
    setCode(code)
    const update = {
      ...data,
      data: code,
    }
    setData(update)
  }

  const setCode = update => {
    setCodeState(update)
    codeRef.current = update
  }

  const toolbar = (
    <>
      <div style={{ marginTop: 'var(--c1)' }}>
        {textEditorData?.name && textEditorData?.name}
      </div>
      <Button onClick={onSave}>
        SAVE
        {unSavedChanges && (
          <span
            style={{
              width: '6px',
              height: '6px',
              background: '#fff',
              borderRadius: '50%',
              marginLeft: '2px',
            }}
          />
        )}
      </Button>
    </>
  )

  if (!textEditorData?.control)
    return <WindowMessage content="Select a node with a text field" />

  return (
    <Window key={inspectorData?.nodeId} toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        // height={height} // This seemed to have been causing issues.
        language={textEditorData?.options?.language}
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
