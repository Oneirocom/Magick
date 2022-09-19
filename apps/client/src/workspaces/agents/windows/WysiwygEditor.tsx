import { useState, useEffect, useRef } from 'react'
import JoditEditor from 'jodit-react'

import WindowMessage from '../../components/WindowMessage'

import '../../../screens/Thoth/thoth.module.css'
import {
  useWysiwygInspector,
  WysiwygEditorData,
} from '@/workspaces/contexts/WysiwygProvider'

const WysiwygEditor = props => {
  const [data, setData] = useState<WysiwygEditorData | null>(null)

  const { textEditorData, saveTextEditor } = useWysiwygInspector()
  const editorRef = useRef(null)
  const [content, setContent] = useState('')
  const [exportTo, setExportTo] = useState('')

  useEffect(() => {
    if (!textEditorData) return
    setData(textEditorData)
    setContent(textEditorData.data as string)
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
    save(content)
  }

  if (!textEditorData?.control)
    return <WindowMessage content="Component has no editable text" />

  return (
    <div className="agent-editor">
      <>
        <div style={{ flex: 1, marginTop: 'var(--c1)' }}>
          {textEditorData?.name}
        </div>
        <button onClick={onSave}>SAVE</button>
      </>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={{ readonly: false, placeholder: 'Start typing' }}
        onBlur={newContent => setContent(newContent)}
        onChange={newContent => {}}
      />
      <div className="form-item agent-select">
        <span className="form-item-label">Export To</span>
        <select
          name="spellHandlerIncoming"
          id="spellHandlerIncoming"
          value={exportTo}
          onChange={event => {
            setExportTo(event.target.value)
          }}
        >
          <option value={'html'}>HTML</option>
        </select>
      </div>
    </div>
  )
}

export default WysiwygEditor
