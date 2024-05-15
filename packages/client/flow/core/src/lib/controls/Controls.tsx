import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import {
  faPause,
  faPlay,
  faSitemap,
  faBug,
  faBugSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import React from 'react'
import { ControlButton, Controls } from '@xyflow/react'

import { ClearModal } from './modals/ClearModal'

export type CustomControlsProps = {
  playing: boolean
  togglePlay: () => void
  toggleDebug: () => void
  isDebug: boolean
  setBehaviorGraph: (value: GraphJSON) => void
  specJson: NodeSpecJSON[] | undefined
  miniMapOpen: boolean
  toggleMiniMap: () => void
}

export const CustomControls: React.FC<CustomControlsProps> = ({
  playing,
  isDebug,
  togglePlay,
  toggleDebug,
  toggleMiniMap,
}) => {
  const [clearModalOpen, setClearModalOpen] = useState(false)

  return (
    <>
      <Controls>
        {/* <ControlButton title="Help" onClick={() => setHelpModalOpen(true)}>
          <FontAwesomeIcon icon={faQuestion} />
        </ControlButton> */}
        <ControlButton title="Minimap" onClick={toggleMiniMap}>
          <FontAwesomeIcon icon={faSitemap} />
        </ControlButton>
        <ControlButton title="Debug" onClick={toggleDebug}>
          <FontAwesomeIcon icon={isDebug ? faBug : faBugSlash} />
        </ControlButton>
        {/* <ControlButton title="Load" onClick={() => setLoadModalOpen(true)}>
          <FontAwesomeIcon icon={faUpload} />
        </ControlButton> */}
        {/* <ControlButton title="Clear" onClick={() => setClearModalOpen(true)}>
          <FontAwesomeIcon icon={faTrash} />
        </ControlButton> */}
        <ControlButton title="Run" onClick={togglePlay}>
          <FontAwesomeIcon icon={playing ? faPlay : faPause} />
        </ControlButton>
      </Controls>
      <ClearModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
      />
    </>
  )
}

export default CustomControls
