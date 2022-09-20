import { useDispatch, useSelector } from 'react-redux'

import SwitchComponent from '../../../../components/Switch/Switch'
import Window from '../../../../components/Window/Window'
import { toggleAutoSave, toggleDoNotShowUnlockWarning } from '../../../../state/preferences'
import { RootState } from '../../../../state/store'

const SettingsWindow = ({ tab }) => {
  const preferences = useSelector((state: RootState) => state.preferences)

  const dispatch = useDispatch()

  const settingControls = {
    doNotShowUnlock: () => dispatch(toggleDoNotShowUnlockWarning()),
    autoSave: () => dispatch(toggleAutoSave()),
  }

  const toolbar = (
    <div style={{ flex: 1, marginTop: 'var(--c1)' }}>Glabal Settings</div>
  )

  type PreferenceType = {
    onClick: () => {}
    label: string
    checked: boolean
  }

  const Setting = (preference: PreferenceType) => (
    <SwitchComponent
      label={preference.label}
      checked={preference.checked}
      onChange={preference.onClick}
    />
  )

  if (!preferences) return <></>
  return (
    <Window toolbar={toolbar}>
      <Setting
        label={'Turn off Autosave'}
        checked={preferences.autoSave}
        onClick={settingControls.autoSave}
      />
      <Setting
        label={'Hide unlock warning'}
        checked={preferences.doNotShowUnlockWarning}
        onClick={settingControls.doNotShowUnlock}
      />
    </Window>
  )
}

export default SettingsWindow
