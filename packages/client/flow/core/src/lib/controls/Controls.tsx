'use client'

import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { faSitemap, faBug } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import React from 'react'
import { ControlButton, Controls } from '@xyflow/react'

import { ClearModal } from './modals/ClearModal'
import { Button } from 'client/core'

export type CustomControlsProps = {
  toggleDebug: () => void
  isDebug: boolean
  setBehaviorGraph: (value: GraphJSON) => void
  specJson: NodeSpecJSON[] | undefined
  miniMapOpen: boolean
  toggleMiniMap: () => void
}

export const CustomControls: React.FC<CustomControlsProps> = ({
  isDebug,
  toggleMiniMap,
  toggleDebug,
}) => {
  const [clearModalOpen, setClearModalOpen] = useState(false)

  return (
    <>
      <Controls>
        <ControlButton title="Minimap" onClick={toggleMiniMap}>
          <FontAwesomeIcon icon={faSitemap} />
        </ControlButton>
        <Button onClick={toggleDebug} className="bg-[--background-color]">
          <FontAwesomeIcon
            icon={faBug}
            className={`${
              isDebug
                ? 'text-[#3acd44] hover:text-[#21f343]'
                : 'text-white hover:text-[#3acd44]'
            }`}
            size="xs"
          />
        </Button>
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
