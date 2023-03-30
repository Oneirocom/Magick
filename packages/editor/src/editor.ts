// GENERATED 
import ConnectionPlugin from 'rete-connection-plugin';
import { Data } from 'rete/types/core/data';
import { Plugin } from 'rete/types/core/plugin';
import gridimg from './grid.png';
import CommentPlugin from './plugins/commentPlugin';
import ContextMenuPlugin from './plugins/contextMenu';
import {
  OnSubspellUpdated,
  PubSubCallback,
  PubSubContext,
  SelectionPlugin,
} from '@magickml/engine';
import ReactRenderPlugin, {
  ReactRenderPluginOptions,
} from './plugins/reactRenderPlugin';

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
} from '@magickml/engine';

import AreaPlugin from './plugins/areaPlugin';
import { initSharedEngine, MagickEngine } from '@magickml/engine';

interface MagickEngineClient extends MagickEngine {
  magick: EditorContext;
}

/** Initialize the rete editor with provided configuration. */
const editorTabMap: Record<string, MagickEditor> = {};

export const initEditor = function ({
  container,
  pubSub,
  magick,
  tab,
  node,
  client,
}: {
  container: any;
  pubSub: PubSubContext;
  magick: any;
  tab: any;
  node: any;
  client?: any;
}) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear();

  // Get the list of nodes available for editor
  const components = getNodes();

  // Initialize the new MagickEditor instance
  const editor = new MagickEditor('demo@0.1.0', container);

  // Store the MagickEditor instance using tab id
  editorTabMap[tab.id] = editor;

  // Setup editor attributes
  editor.pubSub = pubSub;
  editor.magick = magick;
  editor.tab = tab;

  // Initialize the editor with necessary plugins
  if (client) {
    editor.use(SocketOverridePlugin);
  }
  editor.use(HistoryPlugin, { keyboard: false });
  editor.use(ConnectionPlugin);
  editor.use<Plugin, ReactRenderPluginOptions>(ReactRenderPlugin, {
    component: node as any,
  });
  editor.use(LifecyclePlugin);
  editor.use(ContextMenuPlugin, {
    searchBar: false,
    delay: 0,
    rename(component: { contextMenuName: any; name: any }) {
      return component.contextMenuName || component.name;
    },
    nodeItems: () => {
      return { Deleted: true, Clone: true, Copy: true, Paste: true };
    },
    allocate: (component: MagickComponent<unknown>) => {
      const tabType = editor.tab.type;
      const { workspaceType } = component;

      if (component.hide) return null;
      if (workspaceType && workspaceType !== tabType) return null;
      return [component.category];
    },
  });

  editor.use(MultiCopyPlugin);
  editor.use(ConsolePlugin);
  editor.use(SocketGeneratorPlugin);
  editor.use(MultiSocketGenerator);
  editor.use(InspectorPlugin);
  editor.use(NodeClickPlugin);

  const background = document.createElement('div') as HTMLElement;
  background.classList.add('background-grid');
  background.style.backgroundImage = `url('${gridimg}')`;
  container.insertAdjacentElement('beforebegin', background);

  editor.use(AreaPlugin, { scaleExtent: { min: 0.1, max: 1.5 }, background, tab });
  editor.use(CommentPlugin, { margin: 30 });
  editor.use(KeyCodePlugin);

  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components,
    server: false,
  }) as MagickEngineClient;
  engine.magick = magick;

  if (client) {
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine });
    editor.use<Plugin, SocketPluginArgs>(SocketPlugin, { client });
  } else {
    editor.use<Plugin, ModulePluginArgs>(ModulePlugin, { engine });
    editor.use(TaskPlugin);
  }

  editor.use(SelectionPlugin, { enabled: true });

  components.forEach((c: any) => {
    editor.register(c);
  });

  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick';
  });

  editor.on('multiselectnode', args => (args.accumulate = args.e.ctrlKey || args.e.metaKey));

  editor.onSpellUpdated = (spellId: string, callback: OnSubspellUpdated) => {
    return magick.onSubspellUpdated(spellId, callback);
  };

  editor.abort = async () => {
    await engine.abort();
  };

  editor.runProcess = async callback => {
    await engine.abort();
    await engine.process(editor.toJSON(), null, {
      magick: magick,
      currentSpell: editor.currentSpell,
    });
    if (callback) callback();
  };

  editor.loadSpell = async (spell: any) => {
    if (!spell) return console.error('No spell to load');
    const _graph = spell.graph;
    const graph = JSON.parse(JSON.stringify(_graph));
    await engine.abort();
    editor.fromJSON(graph);

    editor.view.resize();
    editor.runProcess();
    editor.currentSpell = spell;
  };

  editor.runProcess();
  return editor;
};