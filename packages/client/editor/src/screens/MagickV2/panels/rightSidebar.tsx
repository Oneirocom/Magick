import { IGridviewPanelProps } from "dockview"
import { useEffect, useState } from "react"
import { useGlobalLayout } from "../../../contexts/GlobalLayoutProvider"
import { useDrawerAnimation } from "../hooks/useDrawerAnimation"

const STARTING_WIDTH = 5
const ANIMATION_DURATION = 300

const RightSidebar = (props: IGridviewPanelProps<{ title: string, id: string }>) => {
  const { resizing } = useGlobalLayout()
  const [currentWidth, setCurrentWidth] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [savedWidth, setSavedWidth] = useState(0)

  useDrawerAnimation(props, STARTING_WIDTH, ANIMATION_DURATION, 'none', 'ctrl+l');

  useEffect(() => {
    const dispose = props.api.onDidDimensionsChange((e) => {
      setCurrentWidth(e.width)
    })

    return () => {
      dispose.dispose()
    }
  }, [])

  useEffect(() => {
    console.log('resizing', resizing)
    if (resizing && !transitioning) {
      setTransitioning(true)
      setSavedWidth(currentWidth)
      props.api.setConstraints({
        maximumWidth: currentWidth,
        minimumWidth: currentWidth
      })
    }

    if (!resizing && transitioning) {
      setTransitioning(false)
      props.api.setConstraints({
        maximumWidth: 10000,
        minimumWidth: 5
      })
    }
  }, [resizing])


  // useEffect(() => {
  //   if (resizing && transitioning) {
  //     props.api.setSize({ width: savedWidth })
  //   }
  // }, [resizing])

  return (
    <div
      style={{
        height: '100%',
        padding: '20px',
        background: 'var(--dv-group-view-background-color)',
      }}
    >
      {JSON.stringify(props.params)}
    </div>
  )
}

export default RightSidebar