import { GraphData, EditorContext, Spell, MagickEditor } from '@magickml/engine'
import { initEditor } from '../../editor'
import { zoomAt } from '../../plugins/areaPlugin/zoom-at'
import React, {
  useRef,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'

import { getSpellApi } from '../../state/api/spells'
import { useConfig } from '../../contexts/ConfigProvider'

import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import { MyNode } from '../../components/Node/Node'
import gridimg from '../../grid.png'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useMagickInterface } from './MagickInterfaceProvider'
import { useFeathers } from '../../contexts/FeathersProvider'

export type MagickTab = {
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
  getEditor: (): MagickEditor | null => null,
  editor: {} as MagickEditor | null,
  serialize: (): GraphData | undefined => undefined,
  buildEditor: (
    el: HTMLDivElement,
    // todo update this to use proper spell type
    spell: Spell | undefined,
    tab: MagickTab,
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
    // eslint-disable-next-line no-console
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
    const spell = JSON.parse(JSON.stringify(_spell))

    console.log('Loading graph in build editor', spell)
    const graph = spell.graph
    console.log('graph', graph)
    newEditor?.loadGraph(graph)
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
    console.log('loading graph', graph)
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
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const [getSpell, { data: spell, isLoading }] = spellApi.useLazyGetSpellQuery()
  const [loaded, setLoaded] = useState(false)
  const { buildEditor } = useEditor()
  // This will be the main interface between magick and rete
  const reteInterface = useMagickInterface()

  useEffect(() => {
    if (!tab || loaded) return

    if (tab?.spellId)
      getSpell({
        spellId: tab.spellId,
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
              buildEditor(el, spell.data[0], tab, reteInterface)
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
