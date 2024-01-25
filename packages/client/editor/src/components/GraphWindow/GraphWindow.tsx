import { IDockviewPanelProps } from "dockview";
import { useEffect, useRef, useState } from "react";
import { Flow } from "../react-flow/Flow";

import { Tab } from "@magickml/providers";
import { spellApi } from "client/state";

const GraphWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const parentRef = useRef();

  const { data: spell } = spellApi.useGetSpellQuery(
    { id: props.params.spellId },
    { skip: !props?.params?.spellId, refetchOnMountOrArgChange: true }
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

  return (<div style={{ height, width }} ref={parentRef}>
    <Flow
      parentRef={parentRef}
      tab={props.params.tab}
      spell={spell}
    />;
  </div>)
}

export default GraphWindow