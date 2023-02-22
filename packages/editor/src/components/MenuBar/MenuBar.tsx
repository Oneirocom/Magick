import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import css from './menuBar.module.css'
import { activeTabSelector, Tab } from '../../state/tabs'
import { toggleAutoSave } from '../../state/preferences'
import { RootState } from '../../state/store'

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
    if (!activeTab || !activeTab.spellName) return
    activeTabRef.current = activeTab
    console.log('changing current to ', activeTabRef.current)
  }, [activeTab])

  // grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_AVATAR_WINDOW,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $CREATE_CONSOLE,
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
    console.log('SAVING')
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
      spellName: activeTabRef.current.spell,
      name: activeTabRef.current.spell,
    })
  }

  const onNew = () => {
    navigate('/home/create-new')
  }
  const onOpen = () => {
    navigate('/home/all-projects')
  }
  const onImport = () => {
    navigate('/home/all-projects?import')
  }

  const onAvatarWindowCreate = () => {
    publish($CREATE_AVATAR_WINDOW(activeTabRef.current?.id))
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

  const onExport = () => {
    if (!activeTabRef.current) return
    publish($EXPORT(activeTabRef.current.id))
  }

  const onConsole = () => {
    if (!activeTabRef.current) return
    publish($CREATE_CONSOLE(activeTabRef.current.id))
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
        import_spell: {
          onClick: onImport,
          hotKey: 'option+i',
        },
        rename_spell: {
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
    window: {
      items: {
        text_editor: {
          onClick: onTextEditorCreate,
        },
        inspector: {
          onClick: onInspectorCreate,
        },
        avatar: {
          onClick: onAvatarWindowCreate,
        },
        playtest: {
          onClick: onPlaytestCreate,
        },
        console: {
          onClick: onConsole,
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
          {Object.entries(item.items as [string, Record<string, any>][]).map(
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
          {Object.entries(item as [string, Record<string, any>][]).map(
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
