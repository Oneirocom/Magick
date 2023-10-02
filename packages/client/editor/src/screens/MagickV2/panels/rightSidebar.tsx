import { IGridviewPanelProps } from "dockview"
import { useEffect, useState } from "react"
import { useGlobalLayout } from "../../../contexts/GlobalLayoutProvider"
import { usePanelControls } from "../hooks/usePanelControls"

const RightSidebar = (props: IGridviewPanelProps<{ title: string, id: string }>) => {
  usePanelControls(props, 'none', 'ctrl+l');


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