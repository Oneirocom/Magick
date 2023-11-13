import { GraphJSON } from "@magickml/behave-graph";
import { IDockviewPanelProps } from "dockview";
import { useEffect, useRef, useState } from "react";
import { useRegistry } from "../../hooks/react-flow/useRegistry";
import { Flow } from "../react-flow/Flow";

import graph from '../../graphs/graph.json';
import Branch from '../../graphs/core/flow/Branch.json';
import { Tab } from "@magickml/providers";

const GraphWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const examples = {
    branch: Branch as unknown as GraphJSON,
  } as Record<string, GraphJSON>;
  const parentRef = useRef();

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

  return (<div style={{ height, width }} ref={parentRef}>
    <Flow registry={registry} initialGraph={graph} examples={examples} parentRef={parentRef} tab={props.params.tab} />;
  </div>)
}

export default GraphWindow