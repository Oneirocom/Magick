// DOCUMENTED
import ConnectionPlugin from 'rete-connection-plugin'
import { Plugin } from 'rete/types/core/plugin'
import gridimg from './grid.png'
import CommentPlugin from './plugins/commentPlugin'
import ContextMenuPlugin from './plugins/contextMenu'
import {
  CachePlugin,
  OnSubspellUpdated,
  PubSubContext,
  SelectionPlugin,
  SpellInterface,
} from '@magickml/core'
import ReactRenderPlugin, {
  ReactRenderPluginOptions,
} from './plugins/reactRenderPlugin'

import {
  ConsolePlugin,
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
  MultiSocketGenerator,
  NodeClickPlugin,
  SocketGeneratorPlugin,
  SocketOverridePlugin,
  SocketPlugin,
  SocketPluginArgs,
  TaskPlugin,
} from '@magickml/core'

import AreaPlugin from './plugins/areaPlugin'
import AutoArrangePlugin from './plugins/autoArrangePlugin'
import { initSharedEngine, MagickEngine } from '@magickml/core'

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
}: {
  container: any
  pubSub: PubSubContext
  context: any
  tab: any
  node: any
  client?: any
}) {
  // Clear editor instance if it exists for the given tab ID
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear()

  // Retrieve the nodes
  const components = getNodes()

  // Create the main edtor
  const editor = new MagickEditor('demo@0.1.0', container)
  editorTabMap[tab.id] = editor

  // Set up the context for editor
  editor.pubSub = pubSub
  editor.context = context
  editor.tab = tab

  // Initialize plugins
  if (client) {
    editor.use(SocketOverridePlugin)
  }

  editor.use(CachePlugin)

  // History plugin for undo/redo
  editor.use(HistoryPlugin, { keyboard: false })

  // Set up various plugins for editor
  editor.use(ConnectionPlugin)
  editor.use<Plugin, ReactRenderPluginOptions>(ReactRenderPlugin, {
    component: node as any,
  })
  editor.use(LifecyclePlugin)
  editor.use(ContextMenuPlugin, {
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
      return [component.category]
    },
  })

  // Setup additional plugins
  editor.use(MultiCopyPlugin)
  editor.use(ConsolePlugin)
  editor.use(SocketGeneratorPlugin)
  editor.use(MultiSocketGenerator)
  editor.use(InspectorPlugin)
  editor.use(NodeClickPlugin)
  editor.use(AutoArrangePlugin, {
    margin: { x: 50, y: 50 },
    depth: 0,
    hotkey: { key: '/', ctrl: true },
  })

  // Set up background
  const background = document.createElement('div') as HTMLElement
  background.classList.add('background-grid')
  background.style.backgroundImage = `url('${gridimg}')`
  container.insertAdjacentElement('beforebegin', background)

  // Configure Area plugin
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.1, max: 1.5 },
    background,
    tab,
    snap: true,
  })

  // Use CommentPlugin
  editor.use(CommentPlugin, {
    margin: 30,
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
    editor.use<Plugin, SocketPluginArgs>(SocketPlugin, { client })
  } else {
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine })
    editor.use(TaskPlugin)
  }

  // Set up the SelectionPlugin
  editor.use(SelectionPlugin, { enabled: true })

  // Register components for editor
  components.forEach((c: any) => {
    editor.register(c)
  })

  // Event listeners
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick'
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
    await engine.process(editor.toJSON(), null, {
      context: context,
      currentSpell: editor.currentSpell,
    })
    if (callback) callback()
  }

  // Functions to load and run spells
  editor.loadSpell = async (spell: SpellInterface) => {
    if (!spell) return console.error('No spell to load')
    const _graph = spell.graph
    const graph = JSON.parse(JSON.stringify(_graph))
    await engine.abort()
    editor.fromJSON(graph)

    editor.view.resize()
    editor.runProcess()
    editor.currentSpell = spell
  }

  // Start the engine off on first load
  editor.runProcess()
  return editor
}
