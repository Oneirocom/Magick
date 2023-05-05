import { LoadingScreen } from '@magickml/client-core'
import { EditorContext, GraphData, MagickEditor, Spell } from '@magickml/core'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Component } from 'rete/types/engine'

import { useConfig, usePubSub } from '@magickml/client-core'
import { MyNode } from '../components/Node/Node'
import { initEditor } from '../editor'
import { zoomAt } from '../plugins/areaPlugin/zoom-at'
import { spellApi } from '../state/api/spells'
import { useFeathers } from '../../../core/client/src/providers/FeathersProvider'
import { useMagickInterface } from './MagickInterfaceProvider'
import styles from './styles.module.scss'

export type MagickTab = {
  layoutJson: string
  name: string
  id: string
  spell: string
  module: string
  type: string
  active: boolean
}

type EditorContextType = {
  run: () => void
  getEditor: () => MagickEditor | null
  editor: MagickEditor | null
  serialize: () => GraphData | undefined
  buildEditor: (
    el: HTMLDivElement,
    // todo update this to use proper spell type
    spell: Spell | undefined,
    tab: MagickTab,
    reteInterface: EditorContext
  ) => void
  setEditor: (editor: any) => void
  getNodeMap: () => Map<string, Component>
  getNodes: () => any
  loadGraph: (graph: any) => void
  setContainer: (container: HTMLDivElement) => void
  undo: () => void
  redo: () => void
  del: () => void
  multiSelectCopy: () => void
  multiSelectPaste: () => void
  centerNode: (nodeId: number) => void
}

// TODO give better typing to the editor
const Context = createContext<EditorContextType>(undefined!)

export const useEditor = () => useContext(Context)

const ChatProvider = ({ children }) => {
  const [editor, setEditorState] = useState<MagickEditor | null>(null)
  const editorRef = useRef<MagickEditor | null>(null)
  const FeathersContext = useFeathers()
  const client = FeathersContext?.client
  const pubSub = usePubSub()

  const setEditor = editor => {
    editorRef.current = editor
    setEditorState(editor)
  }

  const getEditor = () => {
    if (!editorRef.current) return null
    return editorRef.current
  }

  const buildEditor = async (container, _spell, tab, magick) => {
    const newEditor = await initEditor({
      container,
      pubSub,
      // calling magick during migration of screens
      magick,
      tab,
      // MyNode is a custom default style for nodes
      node: MyNode,
      client,
    })

    // set editor to the map
    setEditor(newEditor)
    // copy spell in case it is read onl
    const spell = JSON.parse(JSON.stringify(_spell ?? '{}'))
    const graph = spell.graph
    newEditor?.loadGraph(graph)
  }

  const run = () => {
    //
  }

  const undo = () => {
    if (!editorRef.current) return
    editorRef.current.trigger('undo')
  }

  const centerNode = (nodeId: number): void => {
    if (!editorRef.current) return
    const editor = editorRef.current
    const node = editor.nodes.find(n => n.id === +nodeId)

    if (node) zoomAt(editor, [node])
  }

  const redo = () => {
    if (!editorRef.current) return
    editorRef.current.trigger('redo')
  }

  const del = () => {
    if (!editorRef.current) return
    editorRef.current.trigger('delete')
  }

  const multiSelectCopy = () => {
    if (!editorRef.current) return
    editorRef.current.trigger('multiselectcopy')
  }

  const multiSelectPaste = () => {
    if (!editorRef.current) return
    editorRef.current.trigger('multiselectpaste')
  }

  const serialize = () => {
    if (!editorRef.current) return
    return editorRef.current.toJSON()
  }

  const getNodeMap = () => {
    return editor && editor.components
  }

  const getNodes = () => {
    return editor && Object.fromEntries(editor.components)
  }

  const loadGraph = graph => {
    if (!editorRef.current) return

    editorRef.current.loadGraph(graph)
  }

  const setContainer = () => {
    //
  }

  const publicInterface = {
    run,
    serialize,
    editor,
    editorRef,
    buildEditor,
    getNodeMap,
    getNodes,
    loadGraph,
    setEditor,
    getEditor,
    undo,
    redo,
    del,
    multiSelectCopy,
    multiSelectPaste,
    setContainer,
    centerNode,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const RawEditor = ({ tab, children }) => {
  const config = useConfig()

  const [getSpell, { data: spell, isLoading }] =
    spellApi.useLazyGetSpellByIdQuery()
  const [loaded, setLoaded] = useState(false)
  const { buildEditor } = useEditor()
  // This will be the main interface between magick and rete
  const reteInterface = useMagickInterface()
  useEffect(() => {
    if (!tab || loaded) return
    getSpell({
      spellName: tab.name,
      id: tab.id,
      projectId: config.projectId,
    })
  }, [tab])

  if (!tab || (tab.type === 'spell' && (isLoading || !spell)))
    return <LoadingScreen />

  return (
    <>
      <div
        style={{}}
        id="editor-container"
        className={styles['editor-container']}
        ref={el => {
          if (el && !loaded && spell) {
            buildEditor(el, spell.data[0], tab, reteInterface)
            setLoaded(true)
          }
        }}
      />
      {children}
    </>
  )
}

export const Editor: any = React.memo(RawEditor)

Editor.whyDidYouRender = false

export default ChatProvider
