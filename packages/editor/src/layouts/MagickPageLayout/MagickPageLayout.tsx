// DOCUMENTED
/**
 * Module for the MagickPageWrapper component.
 * @module MagickPageWrapper
 */

import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import css from './pagewrapper.module.css'
import { activeTabSelector, selectAllTabs } from '../../state/tabs'
import { RootState } from '../../state/store'

/**
 * Component that wraps the pages of the application with common layout elements.
 * @function
 * @returns {JSX.Element} - The JSX element representing the wrapped pages.
 */
const MagickPageWrapper = (): JSX.Element => {
  // Select the active tab from the Redux store.
  const activeTab = useSelector(activeTabSelector)

  // Select all tabs from the Redux store.
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))

  return (
    <div className={css.wrapper} id="wrapper">
      <Outlet />
    </div>
  )
}

export default MagickPageWrapper
