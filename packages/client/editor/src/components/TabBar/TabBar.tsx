// DOCUMENTED
import classnames from 'classnames'
import { VscClose } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import MenuBar from '../MenuBar/MenuBar'
import CreateTab from './CreateTab'
import css from './tabBar.module.css'
import { Icon } from '@magickml/client-core'
import { RootState, changeActive, closeTab, selectAllTabs } from 'client/state'

/**
 * Tab Component
 * @param {Object} tab - tab object containing { id, name, URI }
 * @param {Object} activeTab - currently active tab
 */
const Tab = ({ tab, activeTabId }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isActive = tab.id === activeTabId

  const title = `${tab.name.split('--')[0]}`
  const tabClass = classnames({
    [css['tabbar-tab']]: true,
    [css['active']]: isActive,
    [css['inactive']]: !isActive,
  })

  /**
   * onClick handler for activating the selected tab
   */
  const onClick = () => {
    // This avoid unnecessary rendering and loading of spell when the same tab is clicked
    if (tab.id === activeTabId) return
    dispatch(changeActive(tab.id))
  }

  /**
   * onClose handler for closing the selected tab and navigating
   * @param {Event} e - Event object from the click event
   */
  const onClose = e => {
    e.stopPropagation()
    navigate('/magick')
    dispatch(closeTab(tab.id))
  }

  const iconStyle = {
    position: 'relative' as const,
    right: 8,
    top: 1,
    color: 'var(--yellow)',
  }

  return (
    <div className={tabClass} onClick={onClick}>
      <Icon name="ankh" style={iconStyle} />
      <p>{title}</p>
      <span onClick={onClose} className={css['tab-close']}>
        <VscClose />
      </span>
    </div>
  )
}

/**
 * TabBar Component
 * @param {Array} tabs - array of tab objects containing { id, name, URI }
 * @param {Object} activeTab - currently active tab
 */
const TabBar = ({ tabs, activeTabId }) => {
  return (
    <div className={css['th-tabbar']}>
      <div className={css['tabbar-section']}>
        <MenuBar />
      </div>
      <div className={css['tabbar-section']}>
        {tabs &&
          tabs.map(tab => (
            <Tab tab={tab} activeTabId={activeTabId} key={tab.id} />
          ))}
      </div>
      <div className={css['tabbar-section']}>
        <CreateTab />
      </div>
    </div>
  )
}

export default TabBar
