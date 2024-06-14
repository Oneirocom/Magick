'use client'

import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { faSitemap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import React from 'react'
import { ControlButton, Controls } from '@xyflow/react'

import { ClearModal } from './modals/ClearModal'

export type CustomControlsProps = {
  setBehaviorGraph: (value: GraphJSON) => void
  specJson: NodeSpecJSON[] | undefined
  miniMapOpen: boolean
  toggleMiniMap: () => void
}

export const CustomControls: React.FC<CustomControlsProps> = ({
  toggleMiniMap,
}) => {
  const [clearModalOpen, setClearModalOpen] = useState(false)

  return (
    <>
      <Controls>
        <ControlButton title="Minimap" onClick={toggleMiniMap}>
          <FontAwesomeIcon icon={faSitemap} />
        </ControlButton>
        {/* <ControlButton title="Load" onClick={() => setLoadModalOpen(true)}>
          <FontAwesomeIcon icon={faUpload} />
        </ControlButton> */}
        {/* <ControlButton title="Clear" onClick={() => setClearModalOpen(true)}>
          <FontAwesomeIcon icon={faTrash} />
        </ControlButton> */}
      </Controls>
      <ClearModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
      />
    </>
  )
}

export default CustomControls
