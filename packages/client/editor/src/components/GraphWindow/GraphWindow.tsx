import { GraphJSON } from "@magickml/behave-graph";
import { IDockviewPanelProps } from "dockview";
import { useEffect, useRef, useState } from "react";
import { useRegistry } from "../../hooks/react-flow/useRegistry";
import { Flow } from "../react-flow/Flow";

import graph from '../../graphs/graph.json';
import Branch from '../../graphs/core/flow/Branch.json';
import { Tab, useConfig } from "@magickml/providers";
import { spellApi } from "client/state";
import { SpellInterface } from "shared/core";

const GraphWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const examples = {
    branch: Branch as unknown as GraphJSON,
  } as Record<string, GraphJSON>;

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

  const registry = useRegistry();

  if (!spell?.data) return null

  console.log('SPELL', spell)

  return (<div style={{ height, width }} ref={parentRef}>
    <Flow
      registry={registry}
      parentRef={parentRef}
      tab={props.params.tab}
      spell={spell.data[0]}
    />;
  </div>)
}

export default GraphWindow