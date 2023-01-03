import { createRoot } from 'react-dom/client'
import { NodeEditor } from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
// import ConnectionReroutePlugin from 'rete-connection-reroute-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import { Data } from 'rete/types/core/data'

import { EditorContext } from '../types'
import { ThothNode } from './../types'
import { getComponents } from './components'
import { initSharedEngine, ThothEngine } from './engine'
import AreaPlugin from './plugins/areaPlugin'
import CommentPlugin from './plugins/commentPlugin'
import DebuggerPlugin from './plugins/debuggerPlugin'
import DisplayPlugin from './plugins/displayPlugin'
import errorPlugin from './plugins/errorPlugin'
import HistoryPlugin from './plugins/historyPlugin'
import InspectorPlugin from './plugins/inspectorPlugin'
import KeyCodePlugin from './plugins/keyCodePlugin'
import LifecyclePlugin from './plugins/lifecyclePlugin'
import ModulePlugin from './plugins/modulePlugin'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import MultiSocketGenerator from './plugins/multiSocketGenerator'
import SocketGenerator from './plugins/socketGenerator'
import SocketPlugin from './plugins/socketPlugin'
import SocketOverridePlugin from './plugins/socketPlugin/socketOverridePlugin'
import TaskPlugin, { Task } from './plugins/taskPlugin'
import { PubSubContext, ThothComponent } from './thoth-component'
import ReactRenderPlugin from './plugins/reactRenderPlugin'
// import SelectionPlugin from './plugins/selectionPlugin'

interface ThothEngineClient extends ThothEngine {
  thoth: EditorContext
}
export class ThothEditor extends NodeEditor {
  tasks: Task[]
  pubSub: PubSubContext
  thoth: EditorContext
  tab: { type: string }
  abort: unknown
  loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>
  moduleManager: ModuleManager
  runProcess: (callback?: Function) => Promise<void>
  onSpellUpdated: (spellId: string, callback: Function) => Function
}

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/

const editorTabMap: Record<string, ThothEditor> = {}

export const initEditor = function ({
  container,
  pubSub,
  thoth,
  tab,
  node,
  client,
  feathers,
}: {
  container: any
  pubSub: any
  thoth: any
  tab: any
  node: any
  client?: any
  feathers?: any
}) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear()

  const components = getComponents()

  // create the main edtor
  const editor = new ThothEditor('demo@0.1.0', container)

  editorTabMap[tab.id] = editor

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub
  editor.thoth = thoth
  editor.tab = tab

  // ██████╗ ██╗     ██╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
  // ██╔══██╗██║     ██║   ██║██╔════╝ ██║████╗  ██║██╔════╝
  // ██████╔╝██║     ██║   ██║██║  ███╗██║██╔██╗ ██║███████╗
  // ██╔═══╝ ██║     ██║   ██║██║   ██║██║██║╚██╗██║╚════██║
  // ██║     ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
  // ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

  if (client && feathers) {
    editor.use(SocketOverridePlugin, { client })
  }

  // History plugin for undo/redo
  editor.use(HistoryPlugin, { keyboard: false })

  // PLUGINS
  // https://github.com/retejs/comment-plugin
  // connection plugin is used to render conections between nodes
  editor.use(ConnectionPlugin)
  // @seang: temporarily disabling because dependencies of ConnectionReroutePlugin are failing validation on server import of thoth-core
  // editor.use(ConnectionReroutePlugin)
  // React rendering for the editor
  editor.use(ReactRenderPlugin, {
    // this component parameter is a custom default style for nodes
    component: node as any,
    createRoot,
  })
  // renders a context menu on right click that shows available nodes
  editor.use(LifecyclePlugin)
  editor.use(ContextMenuPlugin, {
    searchBar: false,
    delay: 0,
    rename(component: { contextMenuName: any; name: any }) {
      return component.contextMenuName || component.name
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nodeItems: (_node: ThothNode) => {
      return {
        Deleted: true,
        Clone: true,
      }
    },
    allocate: (component: ThothComponent<unknown>) => {
      const tabType = editor.tab.type
      const { workspaceType } = component

      if (component.hide) return null
      if (workspaceType && workspaceType !== tabType) return null
      return [component.category]
    },
  })

  // This should only be needed on client, not server
  editor.use(DebuggerPlugin)
  editor.use(SocketGenerator)
  editor.use(MultiSocketGenerator)
  editor.use(DisplayPlugin)
  editor.use(InspectorPlugin)
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.025, max: 2 },
  })

  // The engine is used to process/run the rete graph

  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components,
    server: false,
    modules: {},
  }) as ThothEngineClient
  engine.use(errorPlugin)
  engine.thoth = thoth
  // @seang TODO: update types for editor.use rather than casting as unknown here, we may want to bring our custom rete directly into the monorepo at this point

  editor.onSpellUpdated = (spellId: string, callback: Function) => {
    return thoth.onSubspellUpdated(spellId, callback)
  }

  editor.use(KeyCodePlugin)

  if (client && feathers) {
    editor.use(SocketPlugin, { client })
  } else {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    editor.use(ModulePlugin, { engine, modules: {} } as unknown as void)
    editor.use(TaskPlugin)
  }

  // editor.use(SelectionPlugin, { enabled: true })

  editor.use(CommentPlugin, {
    margin: 20, // indent for new frame comments by default 30 (px)
  })

  // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
  components.forEach((c: any) => {
    // the problematic type here is coming directly from node modules, we may need to revisit further customizing the Editor Register type expectations or it's class
    editor.register(c)
  })

  // @seang: moved these two functions to attempt to preserve loading order after the introduction of initSharedEngine
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick'
  })

  editor.on(['click'], () => {
    editor.selected.list = []
  })

  editor.bind('run')
  editor.bind('save')

  // ██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗
  // ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝
  // ██████╔╝██║   ██║██████╔╝██║     ██║██║
  // ██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║
  // ██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗
  // ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝

  editor.abort = async () => {
    await engine.abort()
  }

  editor.runProcess = async (callback: Function) => {
    await engine.abort()
    await engine.process(editor.toJSON(), null, { thoth: thoth })
    if (callback) callback()
  }

  editor.loadGraph = async (_graph: Data) => {
    const graph = JSON.parse(JSON.stringify(_graph))
    await engine.abort()
    editor.fromJSON(graph)
    editor.view.area.translate(0, 0)
    editor.view.resize()
  }

  // Start the engine off on first load
  editor.runProcess()
  return editor
}
