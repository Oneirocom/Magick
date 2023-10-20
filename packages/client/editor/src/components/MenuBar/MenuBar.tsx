// DOCUMENTED
import { useFeatureFlagEnabled } from 'posthog-js/react'
import NewMenuBar from './newMenuBar'
import { FEATURE_FLAGS } from 'shared/config'

/**
 * MenuBar component
 *
 * @returns {JSX.Element}
 */
const MenuBar = () => {
  const showNavBarFlag = useFeatureFlagEnabled('ide-new-sidebar')

  return (
    <NewMenuBar />
  )
}

export default MenuBar
