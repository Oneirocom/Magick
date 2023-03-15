import { useEffect, useState } from 'react'
import WindowMessage from '../../components/WindowMessage'
import { useModal } from '../../../contexts/ModalProvider'
import { Icon, componentCategories, Tooltip } from '@magickml/client-core'
import DataControls from '../DataControls'
import { Window } from '@magickml/client-core'
import { useInspector } from '../../contexts/InspectorProvider'
import { Help } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const Inspector = props => {
  const { inspectorData, saveInspector } = useInspector()

  const [width, setWidth] = useState()
  const { openModal } = useModal()
  // const preferences = useSelector((state: RootState) => state.preferences)
  // const dispatch = useDispatch()

  useEffect(() => {
    if (props?.node?._rect?.width) {
      setWidth(props.node._rect.width)
    }

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener('resize', data => {
      setTimeout(() => {
        setWidth(data.rect.width)
      }, 0)
    })

    return () => {
      props.node.removeEventListener('resize')
    }
  }, [props])

  const updateControl = control => {
    if (!inspectorData) return
    const newData = {
      ...inspectorData,
    }

    saveInspector(newData)
  }

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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Icon
          name={componentCategories[inspectorData?.category || 0]}
          style={{ marginRight: 'var(--extraSmall)' }}
        />
        {inspectorData?.name}
      </div>
      {inspectorData?.info && (
        <Tooltip title="Help" placement="bottom">
          <IconButton
            style={{ height: '30px', width: '30px' }}
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
    <Window toolbar={toolbar} darker outline borderless>
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
