import { Outlet } from 'react-router-dom'

import css from './pagewrapper.module.css'
import { useSelector } from 'react-redux'
import { activeTabSelector, selectAllTabs } from '../../state/tabs'
import { RootState } from '../../state/store'

const MagickPageWrapper = () => {
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)

  return (
    <div className={css['wrapper']}>
      <Outlet />
    </div>
  )
}
export default MagickPageWrapper
