import { activeTabSelector, Tab } from '@/state/tabs'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import thothlogo from './thoth.png'

import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import css from './menuBar.module.css'
import { toggleAutoSave } from '@/state/preferences'
import { RootState } from '@/state/store'

const MenuBar = () => {
  const navigate = useNavigate()
  const { publish, events } = usePubSub()
  const dispatch = useDispatch()
  const activeTab = useSelector(activeTabSelector)

  const preferences = useSelector(
    (state: RootState) => state.preferences
  ) as any

  const { openModal } = useModal()

  const activeTabRef = useRef<Tab | null>(null)

  useEffect(() => {
    if (!activeTab) return
    activeTabRef.current = activeTab
    console.log('changing current to ', activeTabRef.current)
  }, [activeTab])

  // grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_ENT_MANAGER,
    $CREATE_GREETINGS_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_SEARCH_CORPUS,
    $CREATE_MESSAGE_REACTION_EDITOR,
    $CREATE_TEXT_EDITOR,
    $CREATE_WYSIWYG_EDITOR,
    $CREATE_CONSOLE,
    $CREATE_EVENT_MANAGER,
    $CREATE_VIDEO_TRANSCRIPTION,
    $CREATE_CALENDAR_TAB,
    $CREATE_SETTINGS_WINDOW,
    $SERIALIZE,
    $EXPORT,
    $UNDO,
    $REDO,
  } = events

  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue)
    const toggle = React.useCallback(() => {
      setValue(v => !v)
    }, [])
    return [value, toggle as () => void]
  }
  const [menuVisibility, togglemenuVisibility] = useToggle()

  const onSave = () => {
    if (!activeTabRef.current) return
    publish($SAVE_SPELL(activeTabRef.current.id))
  }

  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    })
  }

  const onEdit = () => {
    if (!activeTabRef.current) return
    openModal({
      modal: 'editSpellModal',
      content: 'This is an example modal',
      tab: activeTabRef.current,
      spellId: activeTabRef.current.spell,
      name: activeTabRef.current.spell,
    })
  }

  const onNew = () => {
    navigate('/home/create-new')
  }
  const onOpen = () => {
    navigate('/home/all-projects')
  }

  const onSerialize = () => {
    if (!activeTabRef.current) return
    publish($SERIALIZE(activeTabRef.current.id))
  }

  const onStateManagerCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_STATE_MANAGER(activeTabRef.current.id))
  }

  const onCreateSearchCorpus = () => {
    publish($CREATE_SEARCH_CORPUS(activeTabRef.current?.id))
  }

  const onCreateWYSIWYGEditor = () => {
    publish($CREATE_WYSIWYG_EDITOR(activeTabRef.current?.id))
  }

  const onEntityManagerCreate = () => {
    publish($CREATE_ENT_MANAGER(activeTabRef.current?.id))
  }
  
  const onGreetingsManagerCreate = () => {
    publish($CREATE_GREETINGS_MANAGER(activeTabRef.current?.id))
  }

  const onMessageReactionEditorCreate = () => {
    publish($CREATE_MESSAGE_REACTION_EDITOR(activeTabRef.current?.id))
  }

  const onPlaytestCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_PLAYTEST(activeTabRef.current.id))
  }

  const onInspectorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_INSPECTOR(activeTabRef.current.id))
  }

  const onTextEditorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id))
  }

  const onSettingsCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_SETTINGS_WINDOW(activeTabRef.current.id))
  }

  const onExport = () => {
    if (!activeTabRef.current) return
    publish($EXPORT(activeTabRef.current.id))
  }

  const onConsole = () => {
    if (!activeTabRef.current) return
    publish($CREATE_CONSOLE(activeTabRef.current.id))
  }

  const onEventManagerCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_EVENT_MANAGER(activeTabRef.current.id))
  }

  const onVideoTrancriptionCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_VIDEO_TRANSCRIPTION(activeTabRef.current.id))
  }

  const onCalendarTabCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_CALENDAR_TAB(activeTabRef.current.id))
  }

  //Menu bar hotkeys
  useHotkeys(
    'cmd+s, crtl+s',
    event => {
      event.preventDefault()
      onSave()
    },
    { enableOnTags: ['INPUT'] },
    [onSave]
  )

  useHotkeys(
    'option+n, crtl+n',
    event => {
      event.preventDefault()
      onNew()
    },
    { enableOnTags: ['INPUT'] },
    [onNew]
  )
  const onUndo = () => {
    if (!activeTabRef.current) return
    publish($UNDO(activeTabRef.current.id))
  }

  const onRedo = () => {
    if (!activeTabRef.current) return
    publish($REDO(activeTabRef.current.id))
  }

  const toggleSave = () => {
    dispatch(toggleAutoSave())
  }
  //Menu bar entries
  const menuBarItems = {
    file: {
      items: {
        new_spell: {
          onClick: onNew,
          hotKey: 'option+n',
        },
        open_spell: {
          onClick: onOpen,
          hotKey: 'option+o',
        },
        edit_spell: {
          onClick: onEdit,
          hotKey: 'option+e',
        },
        save_spell: {
          onClick: onSave,
          hotKey: 'option+s',
        },
        save_spell_as: {
          onClick: onSaveAs,
          hotKey: 'option+shift+s',
        },
        export_spell: {
          onClick: onExport,
          hotKey: 'option+shift+e',
        },
      },
    },
    edit: {
      items: {
        undo: {
          onClick: onUndo,
          hotKey: 'option+z',
        },
        redo: {
          onClick: onRedo,
          hotKey: 'option+shift+z',
        },
      },
    },
    dev: {
      items: {
        serialize: {
          onClick: onSerialize,
        },
      },
    },
    windows: {
      items: {
        text_editor: {
          onClick: onTextEditorCreate,
        },
        inspector: {
          onClick: onInspectorCreate,
        },
        state_manager: {
          onClick: onStateManagerCreate,
        },
        search_corpus: {
          onClick: onCreateSearchCorpus,
        },
        ent_manager: {
          onClick: onEntityManagerCreate,
        },
        greetings_manager: {
          onClick: onGreetingsManagerCreate,
        },
        wysiwyg_editor: {
          onClick: onCreateWYSIWYGEditor,
        },
        message_reaction_editor: {
          onClick: onMessageReactionEditorCreate,
        },
        playtest: {
          onClick: onPlaytestCreate,
        },
        console: {
          onClick: onConsole,
        },
        event_manager: {
          onClick: onEventManagerCreate,
        },
        video_transcription: {
          onClick: onVideoTrancriptionCreate,
        },
        calendar_tab: {
          onClick: onCalendarTabCreate,
          settings: {
            onClick: onSettingsCreate,
          },
        },
      },
      settings: {
        items: {
          'Auto Save': {
            onClick: toggleSave,
            hotKey: 'option+shift+a',
            isActive: preferences.autoSave,
          },
        },
      },
    },
  }

  const parseStringToUnicode = commandString => {
    let formattedCommand = commandString
    formattedCommand = formattedCommand.replace('option', '\u2325')
    formattedCommand = formattedCommand.replace('shift', '\u21E7')
    formattedCommand = formattedCommand.replace('cmd', '\u2318')
    formattedCommand = formattedCommand.replace(/[`+`]/g, ' ')
    return formattedCommand
  }

  //Menu bar rendering
  const ListItem = ({ item, label, topLevel, onClick, hotKeyLabel }) => {
    label = label ? label.replace(/_/g, ' ') : label
    let children
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css['menu-panel']}>
          {Object.entries(item.items).map(
            ([key, item]: [string, Record<string, any>]) => {
              useHotkeys(
                item.hotKey,
                event => {
                  event.preventDefault()
                  item.onClick()
                },
                { enableOnTags: ['INPUT'] },
                [item.onClick]
              )

              return (
                <ListItem
                  item={item}
                  label={key}
                  topLevel={false}
                  key={key}
                  onClick={item.onClick}
                  hotKeyLabel={item.hotKey}
                />
              )
            }
          )}
        </ul>
      )
    }

    return (
      <li
        className={`${css[topLevel ? 'menu-bar-item' : 'list-item']}`}
        onClick={onClick}
      >
        <span>
          {Object.entries(item).map(
            ([key, value]: [string, Record<string, any>]) => {
              if (key === 'isActive')
                return (
                  <span
                    key={key}
                    className={
                      item.isActive
                        ? css['preference-active']
                        : css['preference-notActive']
                    }
                  >
                    ●{' '}
                  </span>
                )
            }
          )}
          {label}
        </span>
        {hotKeyLabel && <span>{parseStringToUnicode(hotKeyLabel)}</span>}
        {children && <div className={css['folder-arrow']}> ❯ </div>}
        {/* {!topLevel && <br />} */}
        {children}
      </li>
    )
  }

  const handleClick = func => {
    //Initially intended to control the visibility with a state, but this triggers a re-render and hides the menu anyway! :D
    //Keeping this intact just in case.
    ;(togglemenuVisibility as Function)(menuVisibility)
    // eslint-disable-next-line no-eval
    eval(func)
  }

  return (
    <ul className={css['menu-bar']}>
      <img className={css['thoth-logo']} alt="Thoth logo" src={thothlogo} />
      {Object.keys(menuBarItems).map((item, index) => (
        <ListItem
          item={menuBarItems[item]}
          label={Object.keys(menuBarItems)[index]}
          topLevel={true}
          key={index}
          hotKeyLabel={menuBarItems[item].hotKeyLabel}
          onClick={() => {
            handleClick(menuBarItems[item].onClick)
          }}
        />
      ))}
    </ul>
  )
}

export default MenuBar
