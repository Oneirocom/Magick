import { IDockviewPanelProps } from "dockview";
import { useEffect, useRef, useState } from "react";
import { Flow } from "../react-flow/Flow";

import { Tab, useConfig } from "@magickml/providers";
import { spellApi } from "client/state";

const GraphWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {

  const config = useConfig()
  const parentRef = useRef();
  const [loadSpell, { data: spell }] = spellApi.useLazyGetSpellByIdQuery()
  const { tab, spellId } = props.params

  useEffect(() => {
    // If there is no tab, or we already have a spell, return early
    if (!tab || !tab.name) return

    loadSpell({
      spellName: tab.name,
      projectId: config.projectId,
      id: spellId,
    })
  }, [tab])


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

  if (!spell?.data) return null

  return (<div style={{ height, width }} ref={parentRef}>
    <Flow
      parentRef={parentRef}
      tab={props.params.tab}
      spell={spell.data[0]}
    />;
  </div>)
}

export default GraphWindow