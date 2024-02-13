import { IDockviewPanelProps } from 'dockview'
import { useEffect, useRef, useState } from 'react'
import { Flow } from '../react-flow/Flow'

import { Tab } from '@magickml/providers'
import { useGetSpellByNameQuery } from 'client/state'

type Props = IDockviewPanelProps<{
  tab: Tab
  spellId: string
  spellName: string
}>

const GraphWindow = (props: Props) => {
  const { spellName } = props.params
  // Change useRef() to useRef<HTMLDivElement>(null) to match the expected type
  const parentRef = useRef<HTMLDivElement>(null)

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
    const dispose = props.api.onDidDimensionsChange(event => {
      setWidth(event.width)
      setHeight(event.height)
    })

    return () => {
      dispose.dispose()
    }
  })

  if (!spell) return null

  return (
    <div style={{ height, width }} ref={parentRef}>
      <Flow parentRef={parentRef} tab={props.params.tab} spell={spell} />
    </div>
  )
}

export default GraphWindow
