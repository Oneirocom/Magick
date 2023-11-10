// DOCUMENTED
import { componentCategories, Icon, Tooltip, Window } from 'client/core'
import { Help } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import WindowMessage from '../../../../components/WindowMessage'
import { useInspector } from '../../../../contexts/InspectorProvider'
import { useModal } from '../../../../contexts/ModalProvider'
import DataControls from '../../../../DataControls'

/**
 * The Inspector component displays the selected component's data in a window with controls for modifying the data.
 */
const Inspector = props => {
  const { inspectorData, saveInspector } = useInspector()

  const [width] = useState()
  const { openModal } = useModal()

  // useEffect(() => {
  //   if (props?.node?._rect?.width) {
  //     setWidth(props.node._rect.width)
  //   }

  //   // Dynamically set the appropriate height so that Monaco editor doesn't break flexbox when resizing
  //   props.node.setEventListener('resize', (data) => {
  //     setTimeout(() => {
  //       setWidth(data.rect.width)
  //     }, 0)
  //   })

  //   return () => {
  //     props.node.removeEventListener('resize')
  //   }
  // }, [props])

  /**
   * Update a control's properties.
   * @param {Object} control - The control object to update.
   */
  const updateControl = control => {
    if (!inspectorData) return
    const newData = {
      ...inspectorData,
    }

    saveInspector(newData)
  }

  /**
   * Update inspector data.
   * @param {Object} update - Object containing updated data.
   */
  const updateData = update => {
    if (!inspectorData) return
    const newData = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...update,
      },
    }

    saveInspector(newData)
  }

  const toolbar = (
    <>
      <Tooltip title={inspectorData?.name} placement="top-start">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Icon
            name={componentCategories[inspectorData?.category || 0]}
            style={{ marginRight: 'var(--extraSmall)' }}
          />
          {inspectorData?.name}
        </div>
      </Tooltip>
      {inspectorData?.info && (
        <Tooltip title="Help" placement="bottom">
          <IconButton
            style={{ height: '100%', width: '30px' }}
            onClick={() =>
              openModal({
                modal: 'infoModal',
                content: inspectorData?.info,
                title: inspectorData?.name,
              })
            }
          >
            <Help fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </>
  )

  if (!inspectorData) return <WindowMessage />

  return (
    <Window toolbar={toolbar} darker>
      <div style={{ padding: 15 }}>
        <DataControls
          inspectorData={inspectorData}
          nodeId={inspectorData.nodeId}
          dataControls={inspectorData.dataControls}
          data={inspectorData.data}
          width={width}
          updateData={updateData}
          updateControl={updateControl}
        />
      </div>
    </Window>
  )
}

export default Inspector
