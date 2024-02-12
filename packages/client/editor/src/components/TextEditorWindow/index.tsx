import { debounce } from 'lodash'
import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Window } from 'client/core'
import { selectActiveNode, selectTextEditorState, setTextEditorState, selectActiveInput } from 'client/state'
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData'
import WindowMessage from '../WindowMessage/WindowMessage'

const TextEditor = props => {
  const dispatch = useDispatch()
  const [code, setCode] = useState<string | undefined>(undefined)

  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
    fontSize: 16
  })

  const selectedNode = useSelector(selectActiveNode(props.tab.id))
  const handleChange = useChangeNodeData(selectedNode?.id);
  const textEditorState = useSelector(selectTextEditorState)
  const activeInput = useSelector(selectActiveInput)

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
    dispatch(setTextEditorState(code))
    debounceSave(code)
  }

  useEffect(() => {
    if (!selectedNode || textEditorState) return
    const { configuration } = selectedNode.data
    const { textEditorData } = configuration
    if (textEditorData === undefined) return
    setCode(textEditorData)
  }, [selectedNode])

  useEffect(() => {
    if (textEditorState === undefined) return
    setCode(textEditorState || '')
  }, [textEditorState])

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
    const socketRegex = /{{(.+?)}}/g;


    const socketMatches = code.matchAll(socketRegex)
    const sockets = []
    for (const match of socketMatches) {
      if (!match[1]) continue
      const socketName = match[1].split(' ')
        .filter(name =>
          !name.startsWith('#') &&
          !name.startsWith('/') &&
          !name.startsWith('@') &&
          name !== 'this'
        ).join('').trim()

      console.log('Socket name', socketName)

      if (!socketName) continue

      const socket = {
        name: socketName,
        valueType: 'string',
      }

      if (configuration.socketInputs.find(input => input.name === socketName)) continue

      sockets.push(socket)
    }

    handleChange('configuration', {
      ...configuration,
      socketInputs: [
        ...configuration.socketInputs,
        ...sockets.filter(Boolean),
      ],
    })
  }, [code])

  if (!selectedNode) return null

  const { configuration } = selectedNode.data
  const { textEditorOptions, textEditorData } = configuration

  if (textEditorData === undefined || !activeInput)
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
