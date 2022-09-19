import { useEffect, useState } from 'react'

import { useModal } from '@/contexts/ModalProvider'
import Icon, { componentCategories } from '../../../components/Icon/Icon'
import Window from '../../../components/Window/Window'
import DataControls from '../DataControls'
import WindowMessage from '../../components/WindowMessage'
import { useInspector } from '@/workspaces/contexts/InspectorProvider'
import { InspectorData } from '@thothai/core/types'
// import { useWysiwygInspector } from '@/workspaces/contexts/WysiwygProvider'

const Inspector = props => {
  const { inspectorData, saveInspector } = useInspector()
  // const { wysiwygData, saveWysiwyg } = useWysiwygInspector()

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
      dataControls: {
        ...inspectorData.dataControls,
        ...control,
      },
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

  // const onLock = () => {
  //   if (
  //     !preferences.doNotShowUnlockWarning &&
  //     inspectorData?.data.nodeLocked &&
  //     inspectorData?.category === 'I/O'
  //   ) {
  //     openModal({
  //       modal: 'infoModal',
  //       content: 'Editing this node could break connection with your app.',
  //       title: 'Warning',
  //       checkbox: {
  //         onClick: () => dispatch(toggleDoNotShowUnlockWarning()),
  //         label: 'Do not show this again',
  //       },
  //     })
  //   }

  //   const data = {
  //     nodeLocked: !inspectorData?.data.nodeLocked,
  //   }

  //   updateData(data)
  // }

  const toolbar = (
    <>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Icon
          name={componentCategories[inspectorData?.category || 0]}
          style={{ marginRight: 'var(--extraSmall)' }}
        />
        {inspectorData?.name}
      </div>
      {/* I would like to make an "icon button" for this instead of "Help." Leaving it as help just for the function for now.*/}
      {inspectorData?.info && (
        <button
          onClick={() =>
            openModal({
              modal: 'infoModal',
              content: inspectorData?.info,
              title: inspectorData?.name,
            })
          }
        >
          Help
        </button>
      )}
    </>
  )

  const DeprecationMessage = (inspectorData: InspectorData) => {
    if (!inspectorData.deprecated) return <></>
    return (
      <div style={{ padding: 'var(--c1) var(--c2)' }}>
        <h2 style={{ color: 'var(--red)' }}>WARNING</h2>
        <p>{inspectorData.deprecationMessage}</p>
      </div>
    )
  }

  if (!inspectorData) return <WindowMessage />

  return (
    <Window toolbar={toolbar} darker outline borderless>
      {DeprecationMessage(inspectorData)}
      <DataControls
        inspectorData={inspectorData}
        nodeId={inspectorData.nodeId}
        dataControls={inspectorData.dataControls}
        data={inspectorData.data}
        width={width}
        updateData={updateData}
        updateControl={updateControl}
      />
    </Window>
  )
}

export default Inspector
