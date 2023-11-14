import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { usePubSub } from '@magickml/providers'
import { IGridviewPanelProps } from 'dockview'

export const usePanelControls = (
  props: IGridviewPanelProps<{ title: string, id: string }>,
  toggleEventName: string,
  keyCommand?: string,
) => {
  const [currentWidth, setCurrentWidth] = useState(0)
  const { subscribe } = usePubSub()

  if (keyCommand) {
    useHotkeys(keyCommand, () => {
      if (currentWidth > 0) {
        close()
      } else {
        open()
      }
    })
  }

  const open = () => {
    props.api.setVisible(true)
  }

  const close = () => {
    props.api.setVisible(false)
  }

  useEffect(() => {
    const unsubscribe = subscribe(toggleEventName, () => {
      if (currentWidth > 0) {
        close()
      } else {
        open()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [currentWidth, open, close, subscribe, toggleEventName])

  useEffect(() => {
    const dispose = props.api.onDidDimensionsChange(event => {
      setCurrentWidth(event.width)
    })

    return () => {
      dispose.dispose()
    }
  }, [props.api])

  return { open, close, currentWidth }
}