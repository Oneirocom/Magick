import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'

const SettingsWindow = () => {
  const config = useConfig()

  return (
    <div className="settings-editor">
      <div style={{maxWidth: "800px", margin: "1em"}}>
      <p>These settings are stored on your local client</p>
      </div>
    </div>
  )
}

export default SettingsWindow
