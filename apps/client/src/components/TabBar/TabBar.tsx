import classnames from 'classnames'
import { VscClose } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../state/store'
import { changeActive, closeTab, selectAllTabs } from '../../state/tabs'
import MenuBar from '../MenuBar/MenuBar'
import CreateTab from './CreateTab'
import { LoginTab } from './LoginTab'
import css from './tabBar.module.css'

const Tab = ({ tab, activeTab }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const active = tab.id === activeTab?.id

  const title = `${tab.type}- ${tab.name.split('--')[0]}`
  const tabClass = classnames({
    [css['tabbar-tab']]: true,
    [css['active']]: active,
    [css['inactive']]: !active,
  })

  const onClick = () => {
    const updatedTabs = tabs.map(t =>
      t.id === tab.id
        ? {
            id: t.id,
            changes: {
              active: true,
            },
          }
        : {
            id: t.id,
            changes: {
              active: false,
            },
          }
    )
    dispatch(changeActive(updatedTabs))
    navigate('/thoth')
  }

  // Handle selecting the next tab down is none are active.
  const onClose = e => {
    e.stopPropagation()
    navigate('/thoth')
    dispatch(closeTab(tab.id))
  }

  return (
    <div className={tabClass} onClick={onClick}>
      <p>{title}</p>
      <span onClick={onClose}>
        <VscClose />
      </span>
    </div>
  )
}

const TabBar = ({ tabs, activeTab }) => {
  return (
    <div className={css['th-tabbar']}>
      <div className={css['tabbar-section']}>
        <MenuBar />
      </div>
      <div className={css['tabbar-section']}>
        {tabs &&
          tabs.map((tab, i) => <Tab tab={tab} activeTab={activeTab} key={i} />)}
      </div>
      <div className={css['tabbar-section']}>
        <CreateTab />
      </div>

      <div className={css['tabbar-user']}>
        <LoginTab />
      </div>
    </div>
  )
}

export default TabBar
