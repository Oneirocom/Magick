// DOCUMENTED
import { Plugin } from 'shared/rete'
import gridimg from './assets/grid.png'
import CommentPlugin from './plugins/commentPlugin'
import CommentManager from './plugins/commentPlugin/manager'
import ContextMenuPlugin, { ContextMenuOptions } from './plugins/contextMenu'
import HighlightPlugin from './plugins/highlightPlugin'
import ConnectionPlugin from './plugins/connectionPlugin'
import {
  CachePlugin,
  Cfg,
  OnSubspellUpdated,
  PubSubContext,
  RemotePlugin,
  RemotePluginArgs,
  SelectionPlugin,
  SpellInterface,
  DebuggerPlugin,
} from 'shared/core'
import ReactRenderPlugin, {
  ReactRenderPluginOptions,
} from './plugins/reactRenderPlugin'

import {
  EditorContext,
  getNodes,
  HistoryPlugin,
  InspectorPlugin,
  KeyCodePlugin,
  LifecyclePlugin,
  MagickComponent,
  MagickEditor,
  ModulePlugin,
  ModulePluginArgs,
  MultiCopyPlugin,
  NodeClickPlugin,
  SocketGeneratorPlugin,
} from 'shared/core'

import AreaPlugin from './plugins/areaPlugin'
import AutoArrangePlugin from './plugins/autoArrangePlugin'
import { initSharedEngine, MagickEngine } from 'shared/core'
import { createStore } from 'client/state'

/**
 * Extend MagickEngine with additional properties
 */
interface MagickEngineClient extends MagickEngine {
  context: EditorContext
}

// Map of tab IDs to editors
const editorTabMap: Record<string, MagickEditor> = {}

/**
 * Initialize the editor and attach it to the container reference.
 * @param {Object} options - Configuration options for the editor.
 * @returns {MagickEditor} The initialized editor instance.
 */
export const initEditor = function ({
  container,
  pubSub,
  context,
  tab,
  node,
  client,
  spell,
}: {
  container: any
  pubSub: PubSubContext
  context: any
  tab: any
  node: any
  client?: any
  spell: SpellInterface
}) {
  // Clear editor instance if it exists for the given tab ID
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear()
  const store = createStore()

  // Retrieve the nodes
  const components = getNodes()

  // Create the main edtor
  const editor = new MagickEditor('demo@0.1.0', container)
  editorTabMap[tab.id] = editor

  // Set up the context for editor
  editor.pubSub = pubSub
  editor.context = context
  editor.tab = tab
  editor.currentSpell = spell
  editor.tabMap = editorTabMap
  editor.store = store

  editor.use(CachePlugin)

  // handles highlighting nodes and connections on click
  editor.use(HighlightPlugin)

  // History plugin for undo/redo
  editor.use(HistoryPlugin, { keyboard: false })

  // Set up various plugins for editor
  editor.use(ConnectionPlugin)
  editor.use<Plugin, ReactRenderPluginOptions>(ReactRenderPlugin, {
    component: node as any,
  })
  editor.use(LifecyclePlugin)
  editor.use<Plugin, ContextMenuOptions>(ContextMenuPlugin, {
    searchBar: false,
    delay: 0,
    rename(component: { contextMenuName: any; name: any }) {
      return component.contextMenuName || component.name
    },
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

      const path = component.category.split('/')

      return path
    },
  })

  // Setup additional plugins
  editor.use(DebuggerPlugin)
  editor.use(MultiCopyPlugin)
  editor.use(SocketGeneratorPlugin)
  editor.use(InspectorPlugin)
  editor.use(NodeClickPlugin)

  // Set up background
  const background = document.createElement('div') as HTMLElement
  background.classList.add('background-grid')
  background.style.backgroundImage = `url('${gridimg}')`
  container.insertAdjacentElement('beforebegin', background)

  // Configure Area plugin
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.05, max: 2.0 },
    background,
    tab,
    snap: false,
  })

  // Set up the CommentManager
  const commentManager = new CommentManager(editor)

  // Use CommentPlugin
  editor.use(CommentPlugin, {
    margin: 30,
    commentManager,
  })

  editor.use(AutoArrangePlugin, {
    margin: { x: 50, y: 50 },
    depth: 0,
    arrangeHotkey: { key: '/', ctrl: true },
    centerHotkey: { key: '.', ctrl: true },
    commentManager,
  })

  editor.use(KeyCodePlugin)

  // Set up the engine
  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components,
    server: false,
  }) as MagickEngineClient
  engine.context = context

  // Initialize additional plugins
  if (client) {
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine })
    editor.use<Plugin, RemotePluginArgs>(RemotePlugin, { client })
  }

  // Set up the SelectionPlugin
  editor.use<Plugin, Cfg>(SelectionPlugin, { enabled: true })

  // Register components for editor
  components.forEach((c: any) => {
    editor.register(c)
  })

  // Event listeners
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick'
  })

  // Unselect all nodes when clicking off nodes
  editor.on('click', () => {
    const list = [...editor.selected.list]

    editor.selected.clear()
    list.map(node => (node.update ? node.update() : null))
  })

  editor.on(
    'multiselectnode',
    args => (args.accumulate = args.e.ctrlKey || args.e.metaKey)
  )

  // Define additional methods for editor
  editor.onSpellUpdated = (spellId: string, callback: OnSubspellUpdated) => {
    return context.onSubspellUpdated(spellId, callback)
  }

  editor.abort = async () => {
    await engine.abort()
  }

  editor.runProcess = async callback => {
    await engine.abort()
    // await engine.process(editor.toJSON(), null, {
    //   context: context,
    //   currentSpell: editor.currentSpell,
    // })
    if (callback) callback()
  }

  // Functions tAgentMenuo load and run spells
  editor.loadSpell = async (spell: SpellInterface) => {
    if (!spell) return console.error('No spell to load')
    const _graph = spell.graph
    const graph = JSON.parse(JSON.stringify(_graph))
    await engine.abort()
    editor.fromJSON(graph)

    editor.view.resize()
    editor.currentSpell = spell
  }

  editor.resetHighlights = () => {
    const nodeValues = Array.from(editor.view.nodes)
    nodeValues.forEach(([, n]) => {
      n.node.data.error = false
      n.node.data.success = false
      n.onStart()
      n.node.update()
    })
    editor.isHighlighted = false
  }
  return editor
}
