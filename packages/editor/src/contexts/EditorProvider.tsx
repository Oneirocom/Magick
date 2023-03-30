// GENERATED 
import { LoadingScreen } from '@magickml/client-core';
import {
  EditorContext,
  GraphData,
  MagickEditor,
  SpellInterface,
} from '@magickml/engine';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Component } from 'rete/types/engine';

import { MyNode } from '../components/Node/Node';
import { useConfig } from '../contexts/ConfigProvider';
import { useFeathers } from '../contexts/FeathersProvider';
import { usePubSub } from '../contexts/PubSubProvider';
import { initEditor } from '../editor';
import { zoomAt } from '../plugins/areaPlugin/zoom-at';
import { spellApi } from '../state/api/spells';
import { useMagickInterface } from './MagickInterfaceProvider';
import styles from './styles.module.scss';

/**
 * MagickTab type definition.
 */
export type MagickTab = {
  layoutJson: string;
  name: string;
  id: string;
  spell: string;
  module: string;
  type: string;
  active: boolean;
};

/**
 * EditorContextType type definition.
 */
type EditorContextType = {
  run: () => void;
  getEditor: () => MagickEditor | null;
  editor: MagickEditor | null;
  serialize: () => GraphData | undefined;
  buildEditor: (
    el: HTMLDivElement,
    spell: SpellInterface | undefined,
    tab: MagickTab,
    reteInterface: EditorContext
  ) => void;
  setEditor: (editor: any) => void;
  getNodeMap: () => Map<string, Component>;
  getNodes: () => any;
  setContainer: (container: HTMLDivElement) => void;
  undo: () => void;
  redo: () => void;
  del: () => void;
  multiSelectCopy: () => void;
  multiSelectPaste: () => void;
  centerNode: (nodeId: number) => void;
};

// Create a context for the editor
const Context = createContext<EditorContextType>(undefined!);

// Export hook for using the editor context
export const useEditor = () => useContext(Context);

/**
 * EditorProvider component.
 */
const EditorProvider = ({ children }) => {
  const [editor, setEditorState] = useState<MagickEditor | null>(null);
  const editorRef = useRef<MagickEditor | null>(null);
  const FeathersContext = useFeathers();
  const client = FeathersContext?.client;
  const pubSub = usePubSub();

  const setEditor = (editor) => {
    editorRef.current = editor;
    setEditorState(editor);
  };

  const getEditor = () => {
    if (!editorRef.current) return null;
    return editorRef.current;
  };

  const buildEditor = async (container, _spell, tab, magick) => {
    const newEditor = await initEditor({
      container,
      pubSub,
      magick,
      tab,
      node: MyNode,
      client,
    });

    setEditor(newEditor);
    const spell = JSON.parse(JSON.stringify(_spell ?? '{}'));
    newEditor.loadSpell(spell);
  };

  const run = () => {
    //
  };

  const undo = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('undo');
  };

  const centerNode = (nodeId: number): void => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const node = editor.nodes.find((n) => n.id === +nodeId);

    if (node) zoomAt(editor, [node]);
  };

  const redo = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('redo');
  };

  const del = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('delete');
  };

  const multiSelectCopy = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('multiselectcopy');
  };

  const multiSelectPaste = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('multiselectpaste');
  };

  const serialize = () => {
    if (!editorRef.current) return;
    return editorRef.current.toJSON();
  };

  const getNodeMap = () => {
    return editor && editor.components;
  };

  const getNodes = () => {
    return editor && Object.fromEntries(editor.components);
  };

  const setContainer = () => {
    //
  };

  const publicInterface = {
    run,
    serialize,
    editor,
    editorRef,
    buildEditor,
    getNodeMap,
    getNodes,
    setEditor,
    getEditor,
    undo,
    redo,
    del,
    multiSelectCopy,
    multiSelectPaste,
    setContainer,
    centerNode,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

/**
 * RawEditor component.
 */
const RawEditor = ({ tab, children }) => {
  const config = useConfig();

  const [getSpell, { data: spell, isLoading }] =
    spellApi.useLazyGetSpellByIdQuery();
  const [loaded, setLoaded] = useState(false);
  const { buildEditor } = useEditor();
  const reteInterface = useMagickInterface();

  useEffect(() => {
    if (!tab || loaded) return;
    getSpell({
      spellName: tab.name,
      id: tab.id,
      projectId: config.projectId,
    });
  }, [tab]);

  if (!tab || (tab.type === 'spell' && (isLoading || !spell)))
    return <LoadingScreen />;

  return (
    <>
      <div
        style={{}}
        id={`editor-container-${tab.id}`}
        className={styles['editor-container']}
        ref={(el) => {
          if (el && !loaded && spell) {
            buildEditor(el, spell.data[0], tab, reteInterface);
            setLoaded(true);
          }
        }}
      />
      {children}
    </>
  );
};

export const Editor: any = React.memo(RawEditor);

Editor.whyDidYouRender = false;

export default EditorProvider;
