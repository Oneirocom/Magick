// GENERATED 
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useConfig } from '../contexts/ConfigProvider';
import { useEditor } from '../contexts/EditorProvider';
import { Layout } from '../contexts/LayoutProvider';
import { spellApi } from '../state/api/spells';
import { debounce } from '../utils/debounce';
import EventHandler from './EventHandler';

import EditorWindow from '../windows/EditorWindow';
import Inspector from '../windows/InspectorWindow';
import Playtest from '../windows/PlaytestWindow';
import ProjectWindow from '../windows/ProjectWindow';

import DebugConsole from '../windows/DebugConsole';
import TextEditor from '../windows/TextEditorWindow';

import { SpellInterface } from '@magickml/engine';
import React from 'react';
import { useFeathers } from '../contexts/FeathersProvider';
import { usePubSub } from '../contexts/PubSubProvider';
import { RootState } from '../state/store';

/**
 * Workspace component that handles different tabs and their layouts.
 * Each workspace corresponds to a different tab.
 * @param {{tab: object, tabs: object[], pubSub: object}} props
 * @returns {JSX.Element}
 */
const Workspace = ({ tab, tabs, pubSub }) => {
  const config = useConfig();
  const spellRef = useRef<SpellInterface>();
  const { events, publish } = usePubSub();
  const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery();
  const { editor, serialize } = useEditor();
  const FeathersContext = useFeathers();
  const client = FeathersContext?.client;
  const preferences = useSelector((state: RootState) => state.preferences);

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return;
    const unsubscribe = editor.on(
      'nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(async data => {
        if (tab.type === 'spell' && spellRef.current) {
          publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: serialize() });
        }
      }, 2000) // debounce for 2000 ms
    );

    return () => {
      unsubscribe();
    };
  }, [editor, preferences.autoSave]);

  useEffect(() => {
    if (!editor?.on) return;

    const unsubscribe = editor.on('nodecreated noderemoved', (node: any) => {
      if (!spellRef.current) return;
      if (node.category !== 'I/O') return;
      const spell = {
        ...spellRef.current,
        graph: editor.toJSON(),
      };
      publish(events.$SUBSPELL_UPDATED(spellRef.current.id), spell);
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);

  useEffect(() => {
    if (!spellData) return;
    spellRef.current = spellData.data[0];
  }, [spellData]);

  useEffect(() => {
    if (!tab || !tab.name) return;

    loadSpell({
      spellName: tab.name,
      projectId: config.projectId,
      id: tab.id,
    });
  }, [tab]);

  useEffect(() => {
    if (!client) return;
    (async () => {
      if (!client || !tab || !tab.name) return;

      await client.service('spell-runner').get(tab.id, {
        query: {
          projectId: config.projectId,
        },
      });
    })();
  }, [client]);

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      };
      const component = node.getComponent();
      switch (component) {
        case 'playtest':
          return <Playtest {...props} />;
        case 'inspector':
          return <Inspector {...props} />;
        case 'textEditor':
          return <TextEditor {...props} />;
        case 'editorWindow':
          return <EditorWindow {...props} />;
        case 'debugConsole':
          return <DebugConsole {...props} />;
        case 'project':
          return <ProjectWindow {...props} />;
        default:
          return <p></p>;
      }
    };
  };

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  );
};

const Wrapped = props => {
  return <Workspace {...props} />;
};

export default React.memo(Wrapped, (prevProps, nextProps) => {
  return prevProps.tab.id !== nextProps.tab.id;
});
