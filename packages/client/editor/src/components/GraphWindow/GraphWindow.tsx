import { IDockviewPanelProps } from 'dockview'
import { useEffect, useRef, useState } from 'react'
import { CoreFlow } from '@magickml/flow-core'

import { Tab } from '@magickml/providers'
import { RootState, useGetSpellByNameQuery } from 'client/state'
import { useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

type Props = IDockviewPanelProps<{
  tab: Tab
  spellId: string
  spellName: string
}>

const GraphWindow = (props: Props) => {
  const { spellName } = props.params
  // Change useRef() to useRef<HTMLDivElement>(null) to match the expected type
  const parentRef = useRef<HTMLDivElement>(null)

  const { currentSpellReleaseId } = useSelector<
    RootState,
    RootState['globalConfig']
  >(state => state.globalConfig)

  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: data => ({
        spell: data?.data?.data[0],
      }),
    }
  )

  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!props.api || (height && width)) return
    setHeight(props.api.height)
    setWidth(props.api.width)
  }, [props.api])

  useEffect(() => {
    const dispose = props.api.onDidDimensionsChange(event => {
      setWidth(event.width)
      setHeight(event.height)
    })

    return () => {
      dispose.dispose()
    }
  })

  useHotkeys('meta+f, ctrl+f', e => {
    e.preventDefault()
    const isMaximized = props.api.isMaximized()

    if (isMaximized) {
      props.api.exitMaximized()
    } else {
      props.api.maximize()
    }
  })

  if (!spell || !height || !width) return null

  return (
    <div style={{ height, width }} ref={parentRef}>
      <CoreFlow
        windowDimensions={{ height, width }}
        parentRef={parentRef}
        tab={props.params.tab}
        spell={spell}
        readOnly={!!currentSpellReleaseId}
      />
    </div>
  )
}

export default GraphWindow
