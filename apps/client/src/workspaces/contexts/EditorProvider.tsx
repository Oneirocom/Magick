import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import gridimg from '@/grid.png'
import { initEditor } from '@thothai/client-core'
import { EditorContext, GraphData, Spell, ThothEditor, zoomAt } from '@thothai/core'

import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import { MyNode } from '../../components/Node/Node'
import { feathers } from '../../config'
// TODO fix this path import
import { useAuth } from '../../contexts/AuthProvider'
import { useFeathers } from '../../contexts/FeathersProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useLazyGetSpellQuery } from '../../state/api/spells'
import { useThothInterface } from './ThothInterfaceProvider'

export type ThothTab = {
  layoutJson: string
  name: string
  id: string
  spell: string
  module: string
  type: string
  active: boolean
}

// TODO give better typing to the editor
const Context = createContext({
  run: () => {},
  getEditor: (): ThothEditor | null => null,
  editor: {} as ThothEditor | null,
  serialize: (): GraphData | undefined => undefined,
  buildEditor: (
    el: HTMLDivElement,
    // todo update this to use proper spell type
    spell: Spell | undefined,
    tab: ThothTab,
    reteInterface: EditorContext
  ) => {},
  setEditor: (editor: any) => {},
  getNodeMap: () => {},
  getNodes: () => {},
  loadGraph: (graph: any) => {},
  setContainer: () => {},
  undo: () => {},
  redo: () => {},
  del: () => {},
  centerNode: (nodeId: number): void => {},
})

export const useEditor = () => useContext(Context)

const EditorProvider = ({ children }) => {
  const [editor, setEditorState] = useState<ThothEditor | null>(null)
  const editorRef = useRef<ThothEditor | null>(null)
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

  const buildEditor = async (container, _spell, tab, thoth) => {
    // eslint-disable-next-line no-console
    const newEditor = await initEditor({
      container,
      pubSub,
      // calling thoth during migration of screens
      thoth,
      tab,
      // MyNode is a custom default style for nodes
      node: MyNode,
      client,
      feathers,
    })

    if (!newEditor) return

    // set editor to the map
    setEditor(newEditor)

    if (tab.type === 'spell') {
      // copy spell in case it is read onl
      const spell = JSON.parse(JSON.stringify(_spell))
      newEditor.loadGraph(spell.graph)
    }

    if (tab.type === 'module') {
      const moduleDoc = await thoth.getModule(tab.module)
      newEditor.loadGraph(moduleDoc.toJSON().data)
    }
  }

  const run = () => {
    // console.log('RUN')
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
    // console.log('set container')
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
    setContainer,
    centerNode,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const RawEditor = ({ tab, children }) => {
  const { user } = useAuth()
  const [getSpell, { data: spell, isLoading }] = useLazyGetSpellQuery()
  const [loaded, setLoaded] = useState(false)
  const { buildEditor } = useEditor()
  // This will be the main interface between thoth and rete
  const reteInterface = useThothInterface()

  useEffect(() => {
    if (!tab) return

    if (tab?.spellId)
      getSpell({
        spellId: tab.spellId,
        userId: user?.id as string,
      })
  }, [tab])

  if (!tab || (tab.type === 'spell' && (isLoading || !spell)))
    return <LoadingScreen />

  return (
    <>
      <div
        style={{
          textAlign: 'left',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          backgroundColor: '#191919',
          backgroundImage: `url('${gridimg}')`,
        }}
        onDragOver={e => {
          e.preventDefault()
        }}
        onDrop={e => {}}
      >
        <div
          ref={el => {
            if (el && !loaded) {
              buildEditor(el, spell, tab, reteInterface)
              setLoaded(true)
            }
          }}
        />
      </div>
      {children}
    </>
  )
}

export const Editor: any = React.memo(RawEditor)

Editor.whyDidYouRender = false

export default EditorProvider
