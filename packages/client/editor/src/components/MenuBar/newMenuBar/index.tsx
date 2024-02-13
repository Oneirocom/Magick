// DOCUMENTED
import { usePubSub } from '@magickml/providers'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSelector } from 'react-redux'
import { Menu, MenuItem, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import css from '../menuBar.module.css'
import { styled } from '@mui/material/styles'
import { NestedMenuItem } from 'mui-nested-menu'
import { RootState, Tab, rootApi, useAppDispatch } from 'client/state'
import { useModal } from '../../../contexts/ModalProvider'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { PRODUCTION } from 'clientConfig'

function toTitleCase(str) {
  return str
    .split('_') // Split the string by underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ') // Join the words with a space
}

/**
 * MenuBar component
 *
 * @returns {React.JSX.Element}
 */
const NewMenuBar = props => {
  const dispatch = useAppDispatch()
  const { publish, events } = usePubSub()
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { openModal } = useModal()
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const token = globalConfig?.token
  const activeTabRef = useRef<Tab | null>(null)

  useEffect(() => {
    if (!currentTab || !currentTab.id) return
    activeTabRef.current = currentTab
  }, [currentTab])

  // Grab all events we need
  const { $SAVE_SPELL, $EXPORT, $UNDO, $REDO, $DELETE, TOGGLE_SNAP } = events

  /**
   * Save handler
   */
  const onSave = () => {
    if (!activeTabRef.current) return
    publish($SAVE_SPELL(activeTabRef.current?.id))
  }

  /**
   * New handler
   */
  const onNew = () => {
    openModal({
      modal: 'createSpellModal',
    })
  }

  /**
   * Import handler
   */
  const onImport = () => {
    openModal({
      modal: 'createSpellModal',
    })
  }

  /**
   * Export handler
   */
  const onExport = () => {
    if (!activeTabRef.current) return
    publish($EXPORT(activeTabRef.current.id))
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
   * Delete handler
   */
  const onDelete = () => {
    if (!activeTabRef.current) return
    publish($DELETE(activeTabRef.current.id))
  }

  /**
   * Toggle snap handler
   */
  const toggleSnapFunction = () => {
    if (!activeTabRef.current) return
    publish(TOGGLE_SNAP)
    setSnapEnabled(!snapEnabled)
  }

  const loadFile = async (selectedFile, replace) => {
    if (!token && PRODUCTION) {
      enqueueSnackbar('You must be logged in to create a project', {
        variant: 'error',
      })
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = async event => {
      const data = JSON.parse(event?.target?.result as string)

      delete data['id']

      // upload agents
      await axios({
        url: `${globalConfig.apiUrl}/projects?projectId=${globalConfig.projectId}`,
        method: 'POST',
        data: { ...data, projectId: globalConfig.projectId, replace },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      dispatch(rootApi.util.invalidateTags(['Spells', 'Agents', 'Documents']))
    }
  }

  const onImportProject = () => {
    console.log('Clicking import project')
    hiddenFileInput.current?.click()
  }

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(loadFile)
    }
  }

  // Menu bar entries
  const menuBarItems = {
    file: {
      items: {
        new_spell: {
          onClick: onNew,
          hotKey: 'alt+n, ctrl+n',
        },
        import_spell: {
          onClick: onImport,
          hotKey: 'alt+i, ctrl+i',
        },
        save_spell: {
          onClick: onSave,
          hotKey: 'alt+s, ctrl+s',
        },
        export_spell: {
          onClick: onExport,
          hotKey: 'alt+shift+e, ctrl+shift+e',
        },
        import_project: {
          onClick: onImportProject,
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
        delete: {
          onClick: onDelete,
          hotKey: 'delete',
        },
      },
    },
    settings: {
      items: {
        snap: {
          onClick: toggleSnapFunction,
          isActive: snapEnabled,
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
   * @returns {React.JSX.Element}
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
                    console.log('HOTKEYS', item.hotKey)
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
            ([key]: [string, Record<string, any>]) => {
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

  const NestedMenu = styled(NestedMenuItem)(({ theme }) => ({
    backgroundColor: '#2B2B30',
    // change bg color of menu item
    '& .MuiListItem-root': {
      background: '#2B2B30',
      color: '#FFFFFF',
      '&:hover': {
        background: 'red',
      },
    },
  }))

  return (
    <div>
      <input
        id="import"
        type="file"
        multiple
        ref={hiddenFileInput}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <IconButton
        onClick={handleMenuIconClick}
        style={props.style ? props.style : { borderRadius: 0 }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-bar"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '180px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          },
        }}
        MenuListProps={{ sx: { py: 0 } }}
        variant="menu"
      >
        <MenuItem
          onClick={e => {
            window.parent.postMessage({ type: 'redirect', href: '/' }, '*')
            handleMenuClose()
          }}
          sx={{
            '&:hover, &:focus': {
              background: '#49545A',
              outline: 'none',
            },
          }}
          divider={true}
        >
          Home
        </MenuItem>
        {Object.keys(menuBarItems).map((item, index) => (
          <NestedMenu
            key={index}
            parentMenuOpen={isMenuOpen}
            label={Object.keys(menuBarItems)[index].toUpperCase()}
            divider={true}
            sx={{
              '&:hover, &:focus': {
                background: '#49545A',
                outline: 'none',
              },
            }}
            MenuProps={{
              sx: {
                '& .MuiMenu-paper': {
                  background: '#2B2B30',
                  width: '180px',
                  shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  paddingY: 0,
                },
                // remove menulist padding
                '& .MuiMenu-list': {
                  padding: 0,
                  '& .MuiListItem-root': {
                    padding: 0,
                  },
                },
              },
            }}
          >
            {Object.keys(menuBarItems[item].items).map(
              (subMenuKey, subIndex) => {
                const hotKeyLabel = menuBarItems[item]
                  ? menuBarItems[item].items[subMenuKey].hotKey
                  : null
                // add useHotkeys for each sub-menu item
                if (hotKeyLabel) {
                  useHotkeys(
                    menuBarItems[item].items[subMenuKey].hotKey,
                    event => {
                      event.preventDefault()
                      menuBarItems[item].items[subMenuKey].onClick()
                    },
                    { enableOnFormTags: ['INPUT'] },
                    [menuBarItems[item].items[subMenuKey].onClick]
                  )
                }

                return (
                  <MenuItem
                    key={subIndex}
                    onClick={e => {
                      menuBarItems[item].items[subMenuKey].onClick(e)
                      handleMenuClose()
                    }}
                    sx={{
                      '&:hover, &:focus': {
                        background: '#49545A',
                        outline: 'none',
                      },
                    }}
                    divider={true}
                  >
                    <div className={css['menu-item']}>
                      <p>
                        {menuBarItems[item].items[subMenuKey].hasOwnProperty(
                          'isActive'
                        ) && (
                          <span
                            className={
                              menuBarItems[item].items[subMenuKey].isActive
                                ? css['preference-active']
                                : css['preference-notActive']
                            }
                          >
                            ●{' '}
                          </span>
                        )}
                        {toTitleCase(subMenuKey)}
                      </p>

                      {hotKeyLabel &&
                        parseStringToUnicode(
                          hotKeyLabel.slice(0, hotKeyLabel.indexOf(','))
                        )}
                    </div>
                  </MenuItem>
                )
              }
            )}
          </NestedMenu>
        ))}
      </Menu>
    </div>
  )
}

export default NewMenuBar
