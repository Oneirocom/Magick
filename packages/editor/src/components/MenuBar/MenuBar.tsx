// GENERATED 
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useModal } from '../../contexts/ModalProvider';
import { usePubSub } from '../../contexts/PubSubProvider';
import css from './menuBar.module.css';
import { activeTabSelector, Tab } from '../../state/tabs';
import { toggleAutoSave } from '../../state/preferences';
import { RootState } from '../../state/store';

/**
 * MenuBar component.
 * A customizable menu bar with integrated hotkeys and actions.
 */
const MenuBar = () => {
  const navigate = useNavigate();
  const { publish, events } = usePubSub();
  const dispatch = useDispatch();
  const activeTab = useSelector(activeTabSelector);

  const preferences = useSelector(
    (state: RootState) => state.preferences
  ) as any;

  const { openModal } = useModal();

  const activeTabRef = useRef<Tab | null>(null);

  useEffect(() => {
    if (!activeTab || !activeTab.name) return;
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // destructure all event names
  const {
    $SAVE_SPELL,
    $CREATE_PROJECT_WINDOW,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $CREATE_CONSOLE,
    $EXPORT,
    $UNDO,
    $REDO,
    $MULTI_SELECT_COPY,
    $MULTI_SELECT_PASTE,
  } = events;

  /**
   * Custom hook to manage toggle state.
   * @param {boolean} initialValue - initial value of the state.
   * @returns {Array} - array containing the state and toggle function.
   */
  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = React.useCallback(() => {
      setValue((v) => !v);
    }, []);
    return [value, toggle as () => void];
  };
  const [menuVisibility, togglemenuVisibility] = useToggle();

  /**
   * Handle save action.
   */
  const onSave = () => {
    console.log(activeTabRef.current?.id);
    console.log('SAVING');
    publish($SAVE_SPELL(activeTabRef.current?.id));
  };

  /**
   * Handle save as action.
   */
  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    });
  };

  /**
   * Handle edit action.
   */
  const onEdit = () => {
    if (!activeTabRef.current) return;
    openModal({
      modal: 'editSpellModal',
      content: 'This is an example modal',
      tab: activeTabRef.current,
      spellName: activeTabRef.current.spell,
      name: activeTabRef.current.spell,
    });
  };

  /**
   * Handle new action.
   */
  const onNew = () => {
    navigate('/home/create-new');
  };

  /**
   * Handle open action.
   */
  const onOpen = () => {
    navigate('/home/all-projects');
  };

  /**
   * Handle import action.
   */
  const onImport = () => {
    navigate('/home/all-projects?import');
  };

  /**
   * Handle create project window action.
   */
  const onProjectWindowCreate = () => {
    publish($CREATE_PROJECT_WINDOW(activeTabRef.current?.id));
  };

  /**
   * Handle playtest create action.
   */
  const onPlaytestCreate = () => {
    if (!activeTabRef.current) return;
    publish($CREATE_PLAYTEST(activeTabRef.current.id));
  };

  /**
   * Handle inspector create action.
   */
  const onInspectorCreate = () => {
    if (!activeTabRef.current) return;
    publish($CREATE_INSPECTOR(activeTabRef.current.id));
  };

  /**
   * Handle text editor create action.
   */
  const onTextEditorCreate = () => {
    if (!activeTabRef.current) return;
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id));
  };

  /**
   * Handle export action.
   */
  const onExport = () => {
    if (!activeTabRef.current) return;
    publish($EXPORT(activeTabRef.current.id));
  };

  /**
   * Handle console action.
   */
  const onConsole = () => {
    if (!activeTabRef.current) return;
    publish($CREATE_CONSOLE(activeTabRef.current.id));
  };

  // Set up hotkeys for menu bar actions
  useHotkeys(
    'cmd+s, crtl+s',
    (event) => {
      event.preventDefault();
      onSave();
    },
    { enableOnTags: ['INPUT'] },
    [onSave]
  );

  useHotkeys(
    'option+n, crtl+n',
    (event) => {
      event.preventDefault();
      onNew();
    },
    { enableOnTags: ['INPUT'] },
    [onNew]
  );

  /**
   * Handle undo action.
   */
  const onUndo = () => {
    if (!activeTabRef.current) return;
    publish($UNDO(activeTabRef.current.id));
  };

  /**
   * Handle redo action.
   */
  const onRedo = () => {
    if (!activeTabRef.current) return;
    publish($REDO(activeTabRef.current.id));
  };

  /**
   * Handle multi-select copy action.
   */
  const onMultiSelectCopy = () => {
    if (!activeTabRef.current) return;
    publish($MULTI_SELECT_COPY(activeTabRef.current.id));
  };

  /**
   * Handle multi-select paste action.
   */
  const onMultiSelectPaste = () => {
    if (!activeTabRef.current) return;
    publish($MULTI_SELECT_PASTE(activeTabRef.current.id));
  };

  /**
   * Toggle auto-save functionality.
   */
  const toggleSave = () => {
    dispatch(toggleAutoSave());
  };

  // Define menu bar items
  const menuBarItems = {
    //...
  };

  //...
};

export default MenuBar;