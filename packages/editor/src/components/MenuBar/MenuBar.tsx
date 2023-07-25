// DOCUMENTED
import { useProjectWindow, usePubSub } from '@magickml/client-core'
import { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/ModalProvider'
import { toggleAutoSave } from '../../state/preferences'
import { RootState } from '../../state/store'
import { Tab, activeTabSelector, changeEditorLayout } from '../../state/tabs'
import { Menu, MenuItem, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import css from './menuBar.module.css'
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import { CSSTransition } from 'react-transition-group'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<null | string>(null)
  const { openProjectWindow, setOpenProjectWindow, setOpenDrawer } =
    useProjectWindow()

  const preferences = useSelector(
    (state: RootState) => state.preferences
  ) as any

  const { openModal } = useModal()

  const activeTabRef = useRef<Tab | null>(null)
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )

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
    $DELETE,
    TOGGLE_SNAP,
  } = events

  const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

  /**
   * Save handler
   */
  const onSave = () => {
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
   * Delete handler
   */
  const onDelete = () => {
    if (!activeTabRef.current) return
    publish($DELETE(activeTabRef.current.id))
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

  // Menu bar entries
  const menuBarItems = {
    file: {
      items: {
        new_spell: {
          onClick: onNew,
          hotKey: 'alt+n, ctrl+n',
        },
        open_spell: {
          onClick: onOpen,
          hotKey: 'alt+o, ctrl+o',
        },
        import_spell: {
          onClick: onImport,
          hotKey: 'alt+i, ctrl+i',
        },
        rename_spell: {
          onClick: onEdit,
          hotKey: 'alt+e, ctrl+e',
        },
        save_spell: {
          onClick: onSave,
          hotKey: 'alt+s, ctrl+s',
        },
        save_a_copy: {
          onClick: onSaveAs,
          hotKey: 'alt+shift+s, ctrl+shift+s',
        },
        export_spell: {
          onClick: onExport,
          hotKey: 'alt+shift+e, ctrl+shift+e',
        },
      },
    },
    edit: {
      items: {
        undo: {
          onClick: onUndo,
          hotKey: 'alt+z, ctrl+z',
        },
        redo: {
          onClick: onRedo,
          hotKey: 'alt+y, ctrl+y, alt+shift+z, ctrl+shift+z',
        },
        copy: {
          onClick: onMultiSelectCopy,
          hotKey: 'alt+c, ctrl+c',
        },
        paste: {
          onClick: onMultiSelectPaste,
          hotKey: 'alt+v, ctrl+v',
        },
        delete: {
          onClick: onDelete,
          hotKey: 'delete',
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
          hotKey: 'alt+1, control+1',
        },
        inspector: {
          onClick: onInspectorCreate,
          hotKey: 'alt+2, control+2',
        },
        playtest: {
          onClick: onPlaytestCreate,
          hotKey: 'alt+3, control+3',
        },
        console: {
          onClick: onConsole,
          hotKey: 'alt+4, control+4',
        },
        project_window: {
          onClick: onProjectWindowCreate,
          hotKey: 'alt+5, control+5',
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
            hotKey: 'alt+shift+a',
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

    const userAgent = navigator.userAgent

    if (userAgent.indexOf('Win') !== -1) {
      formattedCommand = formattedCommand.replace('option', 'alt')
    } else if (userAgent.indexOf('Linux') !== -1) {
      formattedCommand = formattedCommand.replace('option', 'alt')
    } else {
      formattedCommand = formattedCommand.replace('alt', '\u2325')
    }

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
              // Add hotkeys for each sub-menu item
              if (item.hotKey) {
                useHotkeys(
                  item.hotKey,
                  event => {
                    event.preventDefault()
                    item.onClick()
                  },
                  { enableOnFormTags: ['INPUT'] },
                  [item.onClick]
                )
              }

              return (
                <ListItem
                  item={item}
                  label={key}
                  topLevel={false}
                  key={key}
                  onClick={item.onClick}
                  hotKeyLabel={item.hotKey ? item.hotKey.split(',')[0] : ''}
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



  const handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleMenuHover = (menu: string) => {
    setHoveredMenu(menu)
  }

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: 'black',
    //remove all mergin and padding
    '& .MuiDivider-root': {
      margin: '0px !important',
      padding: '0px !important ',
    },
  }))

  const handleMenuItemLeave = () => {
    setHoveredMenu(null)
  }

  const handleMenuItemEnter = (
    item: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setSubMenuAnchorEl(event.currentTarget) // Set anchor element for sub-menu
    setHoveredMenu(item)
  }

  return (
    <>
      <IconButton
        onClick={handleMenuIconClick}
        onMouseEnter={() => handleMenuHover('menu')}
        onMouseLeave={() => handleMenuHover(null)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-bar"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onMouseEnter={() => handleMenuHover('menu')}
        onMouseLeave={() => handleMenuHover(null)}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '180px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '0px',
          },
        }}
      >
        {Object.keys(menuBarItems).map((item, index) => (
          <>
            <MenuItem
              key={index}
              sx={{ py: 0 }}
              onMouseEnter={event => handleMenuItemEnter(item, event)} // Pass the event to handleMenuEnter
              onMouseLeave={handleMenuItemLeave} // Handle mouse leave
            >
              <div className={css['menu-item']}>
                <p>{Object.keys(menuBarItems)[index].toUpperCase()}</p>
                <KeyboardArrowRightOutlinedIcon />
              </div>
              {/* {hoveredMenu === item && ( */}
              <CSSTransition
                in={hoveredMenu === item}
                timeout={300}
                classNames={{
                  enter: css['menu-item-enter'],
                  enterActive: css['menu-item-enter-active'],
                  exit: css['menu-item-exit'],
                  exitActive: css['menu-item-exit-active'],
                }}
                unmountOnExit
              >
                <Menu
                  id={`sub-menu-${item}`} // Unique ID for each sub-menu
                  anchorEl={subMenuAnchorEl} // Use different anchor element for sub-menu
                  open
                  onClose={() => setHoveredMenu(null)} // Close the sub-menu when the user unhovers from the menu item
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiMenu-paper': {
                      background: '#2B2B30',
                      width: '180px',
                      shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      borderRadius: '0px',
                    },
                  }}
                >
                  {Object.keys(menuBarItems[item].items).map(
                    (subMenuKey, subIndex) => (
                      <MenuItem
                        key={subIndex}
                        onClick={e => {
                          menuBarItems[item].items[subMenuKey].onClick(e)
                          handleMenuClose()
                          console.log('clicked')
                        }}
                      >
                        <div className={css['menu-item']}>

                          <p>
                            {menuBarItems[item].items[subMenuKey].hasOwnProperty("isActive") && (
                              <span
                                className={
                                  menuBarItems[item].items[subMenuKey]
                                    .isActive
                                    ? css['preference-active']
                                    : css['preference-notActive']
                                }
                              >
                                ●{' '}
                              </span>
                            )}
                            {subMenuKey
                              .replace(/_/g, ' ')
                              .charAt(0)
                              .toUpperCase() + subMenuKey.slice(1)}
                          </p>

                          {menuBarItems[item].items[subMenuKey].hotKey &&
                            parseStringToUnicode(
                              menuBarItems[item].items[subMenuKey].hotKey
                                .split(',')[0]
                                .charAt(0)
                                .toUpperCase() +
                              menuBarItems[item].items[subMenuKey].hotKey
                                .split(',')[0]
                                .slice(1)
                            )}



                        </div>
                      </MenuItem>
                    )
                  )}
                </Menu>
              </CSSTransition>
              {/* )} */}
            </MenuItem>
            <StyledDivider />
          </>
        ))}
      </Menu>
    </>
  )
}

export default MenuBar
