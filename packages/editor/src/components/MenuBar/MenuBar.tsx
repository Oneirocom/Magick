// DOCUMENTED
import { useProjectWindow } from '@magickml/client-core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import { toggleAutoSave } from '../../state/preferences'
import { RootState } from '../../state/store'
import { activeTabSelector, changeEditorLayout, Tab } from '../../state/tabs'
import css from './menuBar.module.css'

/**
 * MenuBar component
 *
 * @returns {JSX.Element}
 */
const MenuBar = () => {
  const navigate = useNavigate()
  const { publish, events } = usePubSub()
  const dispatch = useDispatch()
  const activeTab = useSelector(activeTabSelector)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const { openProjectWindow, setOpenProjectWindow, setOpenDrawer } =
    useProjectWindow()
  const [snapEnabled, setSnapEnabled] = useState(true)

  const preferences = useSelector(
    (state: RootState) => state.preferences
  ) as any

  const { openModal } = useModal()

  const activeTabRef = useRef<Tab | null>(null)

  useEffect(() => {
    if (!activeTab || !activeTab.name) return
    activeTabRef.current = activeTab
  }, [activeTab])

  // Grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $CREATE_CONSOLE,
    $EXPORT,
    $UNDO,
    $REDO,
    $MULTI_SELECT_COPY,
    $MULTI_SELECT_PASTE,
    TOGGLE_SNAP,
  } = events

  /**
   * Custom hook for toggling state value between true and false
   *
   * @param {boolean} initialValue
   * @returns {[boolean, () => void]}
   */
  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue)
    const toggle = useCallback(() => {
      setValue(v => !v)
    }, [])
    return [value, toggle as () => void]
  }

  const [menuVisibility, toggleMenuVisibility] = useToggle()

  /**
   * Save handler
   */
  const onSave = () => {
    console.log(activeTabRef.current?.id)
    console.log('SAVING')
    // if (!activeTabRef.current) return
    publish($SAVE_SPELL(activeTabRef.current?.id))
  }

  /**
   * Save as handler
   */
  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    })
  }

  /**
   * Edit handler
   */
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

  /**
   * New handler
   */
  const onNew = () => {
    navigate('/home/create-new')
  }

  /**
   * Open handler
   */
  const onOpen = () => {
    navigate('/home/all-projects')
  }

  /**
   * Import handler
   */
  const onImport = () => {
    navigate('/home/all-projects?import')
  }

  const onPlaytestCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_PLAYTEST(activeTabRef.current.id))
  }

  /**
   * Inspector creation handler
   */
  const onInspectorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_INSPECTOR(activeTabRef.current.id))
  }

  /**
   * Text editor creation handler
   */
  const onTextEditorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id))
  }

  /**
   * Project window creation handler
   */
  const onProjectWindowCreate = () => {
    if (!openProjectWindow) setOpenDrawer(false)
    setOpenProjectWindow(prevState => !prevState)
  }

  /**
   * Export handler
   */
  const onExport = () => {
    if (!activeTabRef.current) return
    publish($EXPORT(activeTabRef.current.id))
  }

  /**
   * Console handler
   */
  const onConsole = () => {
    if (!activeTabRef.current) return
    publish($CREATE_CONSOLE(activeTabRef.current.id))
  }

  // Menu bar hotkey hooks
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

  /**
   * Undo handler
   */
  const onUndo = () => {
    if (!activeTabRef.current) return
    publish($UNDO(activeTabRef.current.id))
  }

  /**
   * Redo handler
   */
  const onRedo = () => {
    if (!activeTabRef.current) return
    publish($REDO(activeTabRef.current.id))
  }

  /**
   * Multi-select copy handler
   */
  const onMultiSelectCopy = () => {
    if (!activeTabRef.current) return
    publish($MULTI_SELECT_COPY(activeTabRef.current.id))
  }

  /**
   * Multi-select paste handler
   */
  const onMultiSelectPaste = () => {
    if (!activeTabRef.current) return
    publish($MULTI_SELECT_PASTE(activeTabRef.current.id))
  }

  /**
   * Toggle save handler
   */
  const toggleSave = () => {
    dispatch(toggleAutoSave())
  }

  /**
   * Toggle snap handler
   */
  const toggleSnapFunction = () => {
    if (!activeTabRef.current) return
    publish(TOGGLE_SNAP)
    setSnapEnabled(!snapEnabled)
  }
  /**
   * Toggle save handler
   */
  const changeLayout = event => {
    const layout: string = event.target.innerText
    const formattedKey = layout
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/\s(.)/g, (_, c) => c.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, (_, c) => c.toLowerCase())

    dispatch(
      changeEditorLayout({
        tabId: activeTab.id,
        layout: formattedKey,
      })
    )
  }
  /**
   * Toggle snap handler
   */
  const toggleSnapFunction = () => {
    if (!activeTabRef.current) return
    publish(TOGGLE_SNAP)
    setSnapEnabled(!snapEnabled)
  }

  // Menu bar entries
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
        save_a_copy: {
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
        copy: {
          onClick: onMultiSelectCopy,
          hotKey: 'option+c',
        },
        paste: {
          onClick: onMultiSelectPaste,
          hotKey: 'option+v',
        },
        snap: {
          onClick: toggleSnapFunction,
          isActive: snapEnabled,
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
        playtest: {
          onClick: onPlaytestCreate,
        },
        console: {
          onClick: onConsole,
        },
        project_window: {
          onClick: onProjectWindowCreate,
          hotKey: 'control+b',
        },
        snap: {
          onClick: toggleSnapFunction,
          isActive: snapEnabled,
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
    layout: {
      items: {
        default: {
          onClick: changeLayout,
        },
        full_screen: {
          onClick: changeLayout,
        },
        prompt_engineering: {
          onClick: changeLayout,
        },
        trouble_shooting: {
          onClick: changeLayout,
        },
      },
    },
  }

  /**
   * Parse command string to Unicode equivalents for better readability
   *
   * @param {string} commandString
   * @returns {string}
   */
  const parseStringToUnicode = (commandString: string) => {
    let formattedCommand = commandString
    if (navigator.userAgent.indexOf('Win') !== -1) {
      formattedCommand = formattedCommand.replace('option', 'alt')
    } else {
      formattedCommand = formattedCommand.replace('option', '\u2325')
    }
    // formattedCommand = formattedCommand.replace('option', '\u2325')
    formattedCommand = formattedCommand.replace('shift', '\u21E7')
    formattedCommand = formattedCommand.replace('cmd', '\u2318')
    formattedCommand = formattedCommand.replace('control', '\u2303')
    formattedCommand = formattedCommand.replace(/[`+`]/g, ' ')
    return formattedCommand
  }

  /**
   * ListItem component
   *
   * @param {any} props
   * @returns {JSX.Element}
   */
  const ListItem = ({
    item,
    label,
    topLevel,
    onClick,
    hotKeyLabel,
  }: {
    item: any
    label: string
    topLevel: boolean
    onClick: () => void
    hotKeyLabel: string
  }) => {
    label = label ? label.replace(/_/g, ' ') : label
    let children
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css['menu-panel']}>
          {Object.entries(item.items as [string, Record<string, any>][]).map(
            ([key, item]: [string, Record<string, any>]) => {
              // useHotkeys(
              //   item.hotKey,
              //   event => {
              //     event.preventDefault()
              //     item.onClick()
              //   },
              //   { enableOnTags: ['INPUT'] },
              //   [item.onClick]
              // )

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
        {children}
      </li>
    )
  }

  /**
   * Click handler
   *
   * @param {() => void} func
   */
  const handleClick = (func: () => void) => {
    // Initially intended to control the visibility with a state, but this triggers a re-render and hides the menu anyway! :D
    // Keeping this intact just in case.
    toggleMenuVisibility(menuVisibility)
    // No need for this
    // func()
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
