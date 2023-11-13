import { Tab } from "@magickml/providers"
import { selectActiveNode } from "client/state"
import { IDockviewPanelProps } from "dockview"
import { useEffect } from "react"
import { useSelector } from "react-redux"

type Props = {
  tab: Tab
}

export const PropertiesWindow = (props: Props) => {
  const selectedNode = useSelector(selectActiveNode(props.tab.id))

  useEffect(() => {
    // console.log('selectedNode', selectedNode)
  }, [selectedNode])

  return (
    <div>Property window</div>
  )
}