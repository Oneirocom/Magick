import Editor from '@monaco-editor/react'
import { useState, useEffect, useRef } from 'react'

import Window from '@components/Window/Window'
import WindowMessage from '../../components/WindowMessage'

import '../../../screens/Thoth/thoth.module.css'
import {
  TextEditorData,
  useInspector,
} from '@/workspaces/contexts/InspectorProvider'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)
  const [data, setData] = useState<TextEditorData | null>(null)
  // const [height, setHeight] = useState<number>()
  const [editorOptions, setEditorOptions] = useState<Record<string, any>>()
  const [typing, setTyping] = useState<boolean>(false)
  const [language, setLanguage] = useState<string | undefined>(undefined)
  const codeRef = useRef<string>()
  const preferences = useSelector((state: RootState) => state.preferences)

  const { textEditorData, saveTextEditor } = useInspector()

  // const bottomHeight = 50
  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#272727',
      },
    })
  }

  useEffect(() => {
    const options = {
      lineNumbers: language === 'javascript',
      minimap: {
        enabled: false,
      },
      suggest: {
        preview: language === 'javascript',
      },
      wordWrap: 'bounded',
      fontSize: 14,
      // fontFamily: '"IBM Plex Mono", sans-serif !important',
    }

    setEditorOptions(options)
  }, [language])

  useEffect(() => {
    if (!textEditorData) return
    setData(textEditorData)
    setCode(textEditorData.data as string)
    setTyping(false)

    if (textEditorData?.options?.language) {
      setLanguage(textEditorData.options.language)
    }
  }, [textEditorData])

  // debounce for delayed save
  useEffect(() => {
    if (!typing) return
    if (!preferences.autoSave) return
    const delayDebounceFn = setTimeout(() => {
      save(code)
      setTyping(false)
    }, 2500)

    return () => clearTimeout(delayDebounceFn)
  }, [code])

  const save = code => {
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    saveTextEditor(update)
  }

  const onSave = () => {
    save(codeRef.current)
  }

  const updateCode = (rawCode: string) => {
    const code = rawCode.replace('\r\n', '\n')
    setCode(code)
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    setTyping(true)
  }

  const setCode = update => {
    setCodeState(update)
    codeRef.current = update
  }

  const toolbar = (
    <>
      <div style={{ flex: 1, marginTop: 'var(--c1)' }}>
        {textEditorData?.name && textEditorData?.name + ' - ' + language}
      </div>
      <button onClick={onSave}>SAVE</button>
    </>
  )

  if (!textEditorData?.control)
    return <WindowMessage content="Component has no editable text" />

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        // height={height} // This seemed to have been causing issues.
        language={language}
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
