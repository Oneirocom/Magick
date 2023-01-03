import { Outlet } from 'react-router-dom'

import TabBar from '../TabBar/TabBar'
import css from './pagewrapper.module.css'
import { useSelector } from 'react-redux'
import { activeTabSelector, selectAllTabs } from '../../state/tabs'
import { RootState } from '../../state/store'

const ThothPageWrapper = () => {
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)

  return (
    <div className={css['wrapper']}>
      <TabBar tabs={tabs} activeTab={activeTab} />
      <Outlet />
    </div>
  )
}
export default ThothPageWrapper
