// DOCUMENTED
import { useFeatureFlagEnabled } from 'posthog-js/react'
import OldMenuBar from './OldMenuBar'
import NewMenuBar from './newMenuBar'

/**
 * MenuBar component
 *
 * @returns {JSX.Element}
 */
const MenuBar = () => {
  const showNavBarFlag = useFeatureFlagEnabled('ide-new-sidebar')

  return <>{showNavBarFlag ? <NewMenuBar /> : <OldMenuBar />}</>
}

export default MenuBar
