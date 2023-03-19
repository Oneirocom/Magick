import ConnectionPlugin from 'rete-connection-plugin'
import { Plugin } from 'rete/types/core/plugin'
// import ConnectionReroutePlugin from 'rete-connection-reroute-plugin'
import ContextMenuPlugin from './plugins/contextMenu'
import { Data } from 'rete/types/core/data'
import CommentPlugin from './plugins/commentPlugin'
import { SelectionPlugin, SubspellUpdatedCallback } from '@magickml/engine'
import ReactRenderPlugin, {
  ReactRenderPluginOptions,
} from './plugins/reactRenderPlugin'
import gridimg from './grid.png'

import {
  // CachePlugin,
  SocketPluginArgs,
  ConsolePlugin,
  HistoryPlugin,
  InspectorPlugin,
  KeyCodePlugin,
  LifecyclePlugin,
  ModulePlugin,
  SocketGeneratorPlugin,
  SocketOverridePlugin,
  SocketPlugin,
  TaskPlugin,
  EditorContext,
  MagickComponent,
  getNodes,
  MagickEditor,
  MultiSocketGenerator,
  NodeClickPlugin,
  ModuleOptions,
  MultiCopyPlugin,
  ModulePluginArgs,
} from '@magickml/engine'

import AreaPlugin from './plugins/areaPlugin'

import { initSharedEngine, MagickEngine } from '@magickml/engine'

interface MagickEngineClient extends MagickEngine {
  magick: EditorContext
}

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/

const editorTabMap: Record<string, MagickEditor> = {}

// todo clean this up by making it a well organized class with proper load functions, etc
export const initEditor = function ({
  container,
  pubSub,
  magick,
  tab,
  node,
  client,
}: {
  container: any
  pubSub: any
  magick: any
  tab: any
  node: any
  client?: any
}) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear()

  const components = getNodes()

  // create the main edtor
  const editor = new MagickEditor('demo@0.1.0', container)

  editorTabMap[tab.id] = editor

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub
  editor.magick = magick
  editor.tab = tab

  // ██████╗ ██╗     ██╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
  // ██╔══██╗██║     ██║   ██║██╔════╝ ██║████╗  ██║██╔════╝
  // ██████╔╝██║     ██║   ██║██║  ███╗██║██╔██╗ ██║███████╗
  // ██╔═══╝ ██║     ██║   ██║██║   ██║██║██║╚██╗██║╚════██║
  // ██║     ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
  // ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

  if (client) {
    editor.use(SocketOverridePlugin)
  }

  // History plugin for undo/redo
  editor.use(HistoryPlugin, { keyboard: false })

  // PLUGINS
  // https://github.com/retejs/comment-plugin
  // connection plugin is used to render conections between nodes
  editor.use(ConnectionPlugin)
  // @seang: temporarily disabling because dependencies of ConnectionReroutePlugin are failing validation on server import of magick-core
  // editor.use(ConnectionReroutePlugin)
  // React rendering for the editor
  // this component parameter is a custom default style for nodes
  editor.use<Plugin, ReactRenderPluginOptions>(ReactRenderPlugin, {
    component: node as any,
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
    nodeItems: () => {
      return {
        Deleted: true,
        Clone: true,
        Copy: true,
        Paste: true,
      }
    },
    allocate: (component: MagickComponent<unknown>) => {
      const tabType = editor.tab.type
      const { workspaceType } = component

      if (component.hide) return null
      if (workspaceType && workspaceType !== tabType) return null
      return [component.category]
    },
  })

  // This should only be needed on client, not server
  editor.use(MultiCopyPlugin)
  editor.use(ConsolePlugin)
  editor.use(SocketGeneratorPlugin)
  editor.use(MultiSocketGenerator)
  editor.use(InspectorPlugin)
  editor.use(NodeClickPlugin)

  const background = document.createElement('div') as HTMLElement
  background.classList.add('background-grid')
  background.style.backgroundImage = `url('${gridimg}')`
  container.insertAdjacentElement('beforebegin', background)

  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.1, max: 1.5 },
    background,
    // snap: true - TODO: add ability to enable and disable snapping to UI
  })

  editor.use(CommentPlugin, {
    margin: 30, // indent for new frame comments by default 30 (px)
  })

  editor.use(KeyCodePlugin)

  // The engine is used to process/run the rete graph

  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components,
    server: false,
  }) as MagickEngineClient
  engine.magick = magick

  if (client) {
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine })
    editor.use<Plugin, SocketPluginArgs>(SocketPlugin, { client })
  } else {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine })
    editor.use(TaskPlugin)
  }

  editor.use(SelectionPlugin, { enabled: true })

  // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
  components.forEach((c: any) => {
    // the problematic type here is coming directly from node modules, we may need to revisit further customizing the Editor Register type expectations or it's class
    editor.register(c)
  })

  // @seang: moved these two functions to attempt to preserve loading order after the introduction of initSharedEngine
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick'
  })

  editor.on(
    'multiselectnode',
    args => (args.accumulate = args.e.ctrlKey || args.e.metaKey)
  )

  editor.bind('run')
  editor.bind('save')

  // ██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗
  // ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝
  // ██████╔╝██║   ██║██████╔╝██║     ██║██║
  // ██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║
  // ██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗
  // ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝
  editor.onSpellUpdated = (spellName: string, callback: SubspellUpdatedCallback) => {
    return magick.onSubspellUpdated(spellName, callback)
  }

  editor.abort = async () => {
    await engine.abort()
  }

  editor.runProcess = async callback => {
    await engine.abort()
    await engine.process(editor.toJSON(), null, { magick: magick })
    if (callback) callback()
  }

  editor.loadGraph = async (_graph: Data) => {
    const graph = JSON.parse(JSON.stringify(_graph))
    await engine.abort()
    editor.fromJSON(graph)

    editor.view.resize()
    editor.runProcess()
  }

  // Start the engine off on first load
  editor.runProcess()
  return editor
}
