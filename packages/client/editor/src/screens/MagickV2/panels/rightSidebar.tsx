import { IGridviewPanelProps } from "dockview"
import { useEffect, useState } from "react"
import { useGlobalLayout } from "../../../contexts/GlobalLayoutProvider"
import { usePanelControls } from "../hooks/usePanelControls"
import { useSelectAgentsLog, useSelectAgentsSpell } from "client/state"
import LogWindow from "../components/logWindow"

const RightSidebar = (props: IGridviewPanelProps<{ title: string, id: string }>) => {
  usePanelControls(props, 'none', 'ctrl+l');
  const { data: LogData } = useSelectAgentsLog()
  const { data: spellData } = useSelectAgentsSpell()
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    if (!spellData || !LogData) return;

    const merged = [...LogData, ...spellData].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      return dateA.getTime() - dateB.getTime();
    });

    console.log("Merged", merged)

    setCombinedData(merged);
  }, [spellData, LogData]);
  return (
    <div
      style={{
        height: '100%',
        background: 'var(--dv-group-view-background-color)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LogWindow logs={combinedData} />
    </div>
  )
}

export default RightSidebar