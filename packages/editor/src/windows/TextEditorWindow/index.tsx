import { Button, Window } from '@magickml/client-core'
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import '../../screens/Magick/magick.module.css'
import WindowMessage from '../../components/WindowMessage'
import { TextEditorData, useInspector } from '../../contexts/InspectorProvider'
import { debounce } from '../../utils/debounce'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)
  const [data, setData] = useState<TextEditorData | null>(null)
  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
  })
  const [unSavedChanges, setUnSavedChanged] = useState<boolean>(false)

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
    setCodeState(textEditorData?.data)
  }, [textEditorData])

  const save = debounce((code) => {
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    saveTextEditor(update)
  }, 1000); // Set the debounce delay as needed (in milliseconds)

  const updateCode = rawCode => {
    if (!unSavedChanges) setUnSavedChanged(true)
    const code = rawCode.replace('\r\n', '\n')
    setCodeState(code)
    save(code); // Call the debounced save function
  }


  if (!textEditorData?.control)
    return <WindowMessage content="Select a node with a text field" />

  return (
    <Window key={inspectorData?.nodeId}>
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
