import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { usePubSub } from '@magickml/providers'
import { useGlobalLayout } from '../../../contexts/GlobalLayoutProvider'
import { IGridviewPanelProps } from 'dockview'

export const useDrawerAnimation = (
  props: IGridviewPanelProps<{ title: string, id: string }>,
  initialSize: number,
  animationDuration: number = 50,
  toggleEventName: string,
  keyCommand?: string,
) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentWidth, setCurrentWidth] = useState(0)
  const [targetWidth, setTargetWidth] = useState(0)
  const { subscribe } = usePubSub()
  const { setResizing } = useGlobalLayout()

  if (keyCommand) {
    useHotkeys(keyCommand, () => {
      if (currentWidth > 0) {
        close()
      } else {
        open()
      }
    })
  }

  const animateSize = (initialWidth: number, targetWidth: number) => {
    let startTimestamp: number | null = null

    const frame = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp

      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / animationDuration, 1)

      const currentWidth =
        initialWidth + (targetWidth - initialWidth) * progress

      props.api.setSize({ width: currentWidth })

      if (progress < 1) {
        requestAnimationFrame(frame)
      } else {
        setIsAnimating(false)
        setResizing(null)
      }
    }

    setResizing({
      id: props.params.id,
      animationDuration: animationDuration,
      size: currentWidth
    })

    setIsAnimating(true)
    requestAnimationFrame(frame)
  }

  const open = () => {
    if (!isAnimating) {
      animateSize(0, targetWidth)
    }
  }

  const close = () => {
    if (!isAnimating) {
      setTargetWidth(currentWidth)
      animateSize(currentWidth, 0)
    }
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

    props.api.setSize({ width: initialSize })

    return () => {
      dispose.dispose()
    }
  }, [props.api, initialSize])

  return { open, close, currentWidth, isAnimating, animationDuration }
}