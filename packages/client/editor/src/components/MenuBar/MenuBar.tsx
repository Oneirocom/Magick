// DOCUMENTED
import { useFeatureFlagEnabled } from 'posthog-js/react'
import OldMenuBar from './OldMenuBar'
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
    <>
      {showNavBarFlag || FEATURE_FLAGS.SHOW_NAVBAR ? (
        <NewMenuBar />
      ) : (
        <OldMenuBar />
      )}
    </>
  )
}

export default MenuBar
