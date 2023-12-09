import {
  IGridviewPanelProps, IPaneviewPanelProps,
  PaneviewReact,
  PaneviewReadyEvent,
} from "dockview"
import { usePanelControls } from "../hooks/usePanelControls"
import LogWindow from "../components/LogWindow/logWindow"

const components = {
  default: (props: IPaneviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          padding: '10px',
          height: '100%',
          backgroundColor: 'rgb(60,60,60)',
        }}
      >
        {props.params.title}
      </div>
    );
  },
  LogPanel: (props: IPaneviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          background: 'var(--background-color)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LogWindow />
      </div>
    )
  }
};

const RightSidebar = (props: IGridviewPanelProps<{ title: string, id: string }>) => {
  usePanelControls(props, 'none', 'ctrl+l');

  const onReady = (event: PaneviewReadyEvent) => {
    event.api.addPanel({
      id: 'Logs',
      component: 'LogPanel',
      params: {
        title: 'Panel 1',
      },
      isExpanded: true,
      title: 'Logs',
    });
  };

  return (
    <PaneviewReact
      components={components}
      // headerComponents={headerComponents}
      onReady={onReady}
      className="dockview-theme-abyss"
    />
  );
}

export default RightSidebar